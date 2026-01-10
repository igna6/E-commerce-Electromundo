import express from 'express'
import config from './config/config.ts'
import db from './db/db.ts'
import { usersTable } from './db/schema.ts'

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Simple GET handler
app.get('/', async (req, res) => {
  res.json({ message: 'Hello from Electromundo API!' })

  const users = await db.select().from(usersTable)

  console.log(users)
})

// Simple POST handler
app.post('/api/data', (req, res) => {
  res.json({
    message: 'Data received',
    data: req.body,
  })
})

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})

export default app
