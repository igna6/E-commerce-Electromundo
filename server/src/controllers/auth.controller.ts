import { Request, Response, NextFunction } from 'express'
import { loginSchema, refreshTokenSchema } from '../validators/auth.ts'
import * as authService from '../services/auth.service.ts'
import { UnauthorizedError } from '../utils/errors.ts'

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = loginSchema.parse(req.body)
    const result = await authService.login(validatedData.email, validatedData.password)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const validatedData = refreshTokenSchema.parse(req.body)
    const result = await authService.refreshToken(validatedData.refreshToken)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logout(req.body.refreshToken)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Not authenticated')
    }
    const user = await authService.getCurrentUser(req.user.userId)
    res.json({ data: user })
  } catch (error) {
    next(error)
  }
}
