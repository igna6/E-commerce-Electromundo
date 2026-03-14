import { and, count, desc, eq, isNull } from 'drizzle-orm'
import db from '../../db/db.ts'
import { ordersTable } from '../../db/schema.ts'
import { BadRequestError, NotFoundError } from '../../utils/errors.ts'
import { paginate } from '../../utils/pagination.ts'
import { fetchOrderWithItems } from '../orders.service.ts'

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

export type AdminOrderFilters = {
  page: number
  limit: number
  status?: string | undefined
}

export async function listOrders(filters: AdminOrderFilters) {
  const { page, limit, status } = filters
  const offset = (page - 1) * limit

  const conditions = [isNull(ordersTable.deletedAt)]

  if (status && VALID_STATUSES.includes(status)) {
    conditions.push(eq(ordersTable.status, status))
  }

  const [orders, totalResult] = await Promise.all([
    db
      .select()
      .from(ordersTable)
      .where(and(...conditions))
      .orderBy(desc(ordersTable.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(ordersTable)
      .where(and(...conditions)),
  ])

  const total = totalResult[0]?.count ?? 0

  return {
    ...paginate(orders, total, page, limit),
    filters: {
      status,
    },
  }
}

export async function getOrderById(id: number) {
  const { order, items } = await fetchOrderWithItems(id)
  return { ...order, items }
}

export async function updateOrderStatus(id: number, status: string) {
  if (!status || !VALID_STATUSES.includes(status)) {
    throw new BadRequestError('Invalid status', { validStatuses: VALID_STATUSES })
  }

  const order = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, id), isNull(ordersTable.deletedAt)))
    .limit(1)

  if (!order[0]) {
    throw new NotFoundError('Order not found')
  }

  const currentStatus = order[0].status
  const allowedTransitions = VALID_TRANSITIONS[currentStatus] || []

  if (!allowedTransitions.includes(status)) {
    throw new BadRequestError(
      `Cannot transition from '${currentStatus}' to '${status}'`,
      { allowedTransitions }
    )
  }

  const updatedOrder = await db
    .update(ordersTable)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(ordersTable.id, id), isNull(ordersTable.deletedAt)))
    .returning()

  return updatedOrder[0]
}
