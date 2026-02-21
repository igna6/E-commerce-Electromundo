import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('Error:', err)

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.issues })
    return
  }

  res.status(500).json({ error: 'Internal server error' })
}
