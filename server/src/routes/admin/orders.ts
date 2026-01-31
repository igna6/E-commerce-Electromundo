import { Router } from 'express'
import { and, count, desc, eq, isNull } from 'drizzle-orm'
import db from '../../db/db'
import { ordersTable, orderItemsTable } from '../../db/schema'

const router = Router()

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

// GET /api/admin/orders - List all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20))
    const offset = (page - 1) * limit
    const status = req.query.status as string

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
    const totalPages = Math.ceil(total / limit)

    res.json({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        status,
      },
    })
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// GET /api/admin/orders/:id - Get order details with items
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' })
    }

    const order = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, id), isNull(ordersTable.deletedAt)))
      .limit(1)

    if (!order[0]) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, id))

    res.json({
      data: {
        ...order[0],
        items,
      },
    })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// PUT /api/admin/orders/:id/status - Update order status
router.put('/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' })
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        validStatuses: VALID_STATUSES,
      })
    }

    const order = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.id, id), isNull(ordersTable.deletedAt)))
      .limit(1)

    if (!order[0]) {
      return res.status(404).json({ error: 'Order not found' })
    }

    const currentStatus = order[0].status
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || []

    if (!allowedTransitions.includes(status)) {
      return res.status(400).json({
        error: `Cannot transition from '${currentStatus}' to '${status}'`,
        allowedTransitions,
      })
    }

    const updatedOrder = await db
      .update(ordersTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ordersTable.id, id))
      .returning()

    res.json({ data: updatedOrder[0] })
  } catch (error: any) {
    console.error('Error updating order status:', error)
    res.status(500).json({ error: 'Failed to update order status' })
  }
})

export default router
