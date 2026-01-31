import express from 'express'
import cors from 'cors'
import config from './config/config.ts'
import productsRouter from './routes/products.ts'
import categoriesRouter from './routes/categories.ts'
import ordersRouter from './routes/orders.ts'
import authRouter from './routes/auth.ts'
import adminRouter from './routes/admin/index.ts'
import { authenticateToken, requireAdmin } from './middleware/auth.ts'
import { errorHandler } from './middleware/errorHandler.ts'

const app = express()

// Enable CORS for frontend requests
app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json())

// Simple GET handler
app.get('/', async (req, res) => {
  res.json({ message: 'Hello from Electromundo API!' })

  // const users = await db.select().from(usersTable)
  // console.log(users)
})

// Simple POST handler
app.post('/api/data', (req, res) => {
  res.json({
    message: 'Data received',
    data: req.body,
  })
})

// Products API
app.use('/api/products', productsRouter)

// Categories API
app.use('/api/categories', categoriesRouter)

// Orders API
app.use('/api/orders', ordersRouter)

// Auth API
app.use('/api/auth', authRouter)

// Admin API (protected)
app.use('/api/admin', authenticateToken, requireAdmin, adminRouter)

// Global error handler (must be last)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})


export default app
