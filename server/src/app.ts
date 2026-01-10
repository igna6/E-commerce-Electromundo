import express from 'express'
import config from './config/config.ts'

const app = express()

// Middleware to parse JSON bodies
app.use(express.json())

// Simple GET handler
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Electromundo API!' })
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
