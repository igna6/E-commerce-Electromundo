import { randomBytes } from 'crypto'
import { and, eq, isNull, inArray, sql } from 'drizzle-orm'
import db from '../db/db.ts'
import { ordersTable, orderItemsTable, productsTable } from '../db/schema.ts'
import { generateOrderText } from '../utils/orderTextGenerator.ts'
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors.ts'

const TAX_RATE = 0.21

type CreateOrderInput = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address?: string | null | undefined
  apartment?: string | null | undefined
  city?: string | null | undefined
  province?: string | null | undefined
  zipCode?: string | null | undefined
  items: Array<{ productId: number; quantity: number }>
}

export async function createOrder(data: CreateOrderInput) {
  const productIds = data.items.map(item => item.productId)
  const products = await db
    .select()
    .from(productsTable)
    .where(and(
      inArray(productsTable.id, productIds),
      isNull(productsTable.deletedAt)
    ))

  const productMap = new Map(products.map(p => [p.id, p]))
  for (const item of data.items) {
    if (!productMap.has(item.productId)) {
      throw new BadRequestError(`Product with ID ${item.productId} not found`)
    }
  }

  const insufficientStock = data.items
    .filter(item => {
      const product = productMap.get(item.productId)!
      return item.quantity > product.stock
    })
    .map(item => {
      const product = productMap.get(item.productId)!
      return {
        productId: item.productId,
        productName: product.name,
        requested: item.quantity,
        available: product.stock,
      }
    })

  if (insufficientStock.length > 0) {
    throw new ConflictError('Stock insuficiente', insufficientStock)
  }

  let subtotal = 0
  const orderItems = data.items.map(item => {
    const product = productMap.get(item.productId)!
    const lineTotal = product.price * item.quantity
    subtotal += lineTotal
    return {
      productId: item.productId,
      productName: product.name,
      productPrice: product.price,
      quantity: item.quantity,
      lineTotal,
    }
  })

  const shippingCost = 0
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + tax
  const accessToken = randomBytes(32).toString('hex')

  const result = await db.transaction(async (tx) => {
    for (const item of data.items) {
      await tx
        .update(productsTable)
        .set({ stock: sql`${productsTable.stock} - ${item.quantity}` })
        .where(eq(productsTable.id, item.productId))
    }

    const insertedOrders = await tx
      .insert(ordersTable)
      .values({
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address ?? null,
        apartment: data.apartment ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        zipCode: data.zipCode ?? null,
        shippingMethod: 'pickup',
        paymentMethod: null,
        accessToken,
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'pending',
        orderText: '',
      })
      .returning()

    const newOrder = insertedOrders[0]
    if (!newOrder) {
      throw new Error('Failed to create order')
    }

    await tx.insert(orderItemsTable).values(
      orderItems.map(item => ({
        orderId: newOrder.id,
        ...item,
      }))
    )

    const orderText = generateOrderText({
      id: newOrder.id,
      email: newOrder.email,
      phone: newOrder.phone,
      firstName: newOrder.firstName,
      lastName: newOrder.lastName,
      address: newOrder.address,
      apartment: newOrder.apartment,
      city: newOrder.city,
      province: newOrder.province,
      zipCode: newOrder.zipCode,
      shippingMethod: newOrder.shippingMethod,
      paymentMethod: newOrder.paymentMethod,
      subtotal: newOrder.subtotal,
      shippingCost: newOrder.shippingCost,
      tax: newOrder.tax,
      total: newOrder.total,
      createdAt: newOrder.createdAt,
      items: orderItems,
    })

    const updatedOrders = await tx
      .update(ordersTable)
      .set({ orderText })
      .where(eq(ordersTable.id, newOrder.id))
      .returning()

    return { order: updatedOrders[0], items: orderItems }
  })

  return {
    ...result.order,
    items: result.items,
  }
}

export async function getOrderById(id: number, token: string) {
  const order = await db
    .select()
    .from(ordersTable)
    .where(and(eq(ordersTable.id, id), isNull(ordersTable.deletedAt)))
    .limit(1)

  if (!order[0]) {
    throw new NotFoundError('Order not found')
  }

  if (order[0].accessToken !== token) {
    throw new UnauthorizedError('Invalid order access token')
  }

  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, id))

  const { accessToken: _token, ...orderWithoutToken } = order[0]
  return {
    ...orderWithoutToken,
    items,
  }
}
