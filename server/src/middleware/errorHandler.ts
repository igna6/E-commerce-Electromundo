import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../utils/errors.ts'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.error('Error:', err)

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: err.issues })
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    })
    return
  }

  res.status(500).json({ error: 'Internal server error' })
}
