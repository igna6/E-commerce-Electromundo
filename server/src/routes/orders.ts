import { Router } from 'express'
import { and, eq, isNull, inArray } from 'drizzle-orm'
import db from '../db/db.ts'
import { ordersTable, orderItemsTable, productsTable } from '../db/schema.ts'
import { createOrderSchema } from '../validators/order.ts'
import { generateOrderText } from '../utils/orderTextGenerator.ts'

const router = Router()

// Shipping costs in cents
const SHIPPING_COSTS: Record<string, number> = {
  pickup: 0,
  standard: 300000, // ARS 3,000
  express: 800000,  // ARS 8,000
}

// Tax rate
const TAX_RATE = 0.21

// POST /api/orders - Create order
router.post('/', async (req, res) => {
  try {
    const validatedData = createOrderSchema.parse(req.body)

    // Fetch products to get current prices
    const productIds = validatedData.items.map(item => item.productId)
    const products = await db
      .select()
      .from(productsTable)
      .where(and(
        inArray(productsTable.id, productIds),
        isNull(productsTable.deletedAt)
      ))

    // Verify all products exist
    const productMap = new Map(products.map(p => [p.id, p]))
    for (const item of validatedData.items) {
      if (!productMap.has(item.productId)) {
        return res.status(400).json({
          error: `Product with ID ${item.productId} not found`
        })
      }
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = validatedData.items.map(item => {
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

    const shippingCost = SHIPPING_COSTS[validatedData.shippingMethod] || 0
    const tax = Math.round(subtotal * TAX_RATE)
    const total = subtotal + shippingCost + tax

    // Create order
    const insertedOrders = await db
      .insert(ordersTable)
      .values({
        email: validatedData.email,
        phone: validatedData.phone,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        address: validatedData.address,
        apartment: validatedData.apartment,
        city: validatedData.city,
        province: validatedData.province,
        zipCode: validatedData.zipCode,
        shippingMethod: validatedData.shippingMethod,
        paymentMethod: validatedData.paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total,
        status: 'pending',
        orderText: '', // Will be updated after we have the ID
      })
      .returning()

    const newOrder = insertedOrders[0]
    if (!newOrder) {
      return res.status(500).json({ error: 'Failed to create order' })
    }

    // Create order items
    await db.insert(orderItemsTable).values(
      orderItems.map(item => ({
        orderId: newOrder.id,
        ...item,
      }))
    )

    // Generate order text
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

    // Update order with generated text
    const updatedOrders = await db
      .update(ordersTable)
      .set({ orderText })
      .where(eq(ordersTable.id, newOrder.id))
      .returning()

    const updatedOrder = updatedOrders[0]

    res.status(201).json({
      data: {
        ...updatedOrder,
        items: orderItems,
      },
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid order data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// GET /api/orders/:id - Get order by ID
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

    // Fetch order items
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

export default router
