import { Router } from 'express'
import { and, eq, isNull, gt } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import db from '../db/db'
import { usersTable, refreshTokensTable } from '../db/schema'
import { loginSchema, refreshTokenSchema } from '../validators/auth'
import config from '../config/config'
import { authenticateToken, JwtPayload } from '../middleware/auth'

const router = Router()

const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions)
}

const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex')
}

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

const getRefreshTokenExpiry = (): Date => {
  const match = config.jwtRefreshExpiresIn.match(/^(\d+)([dhms])$/)
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  }

  const value = parseInt(match[1] as string)
  const unit = match[2] as string

  let ms: number
  switch (unit) {
    case 'd':
      ms = value * 24 * 60 * 60 * 1000
      break
    case 'h':
      ms = value * 60 * 60 * 1000
      break
    case 'm':
      ms = value * 60 * 1000
      break
    case 's':
      ms = value * 1000
      break
    default:
      ms = 7 * 24 * 60 * 60 * 1000
  }

  return new Date(Date.now() + ms)
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body)

    const users = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, validatedData.email), isNull(usersTable.deletedAt)))
      .limit(1)

    const user = users[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(validatedData.password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken()
    const hashedRefreshToken = hashToken(refreshToken)
    const expiresAt = getRefreshTokenExpiry()

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      token: hashedRefreshToken,
      expiresAt,
    })

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const validatedData = refreshTokenSchema.parse(req.body)
    const hashedToken = hashToken(validatedData.refreshToken)

    const tokens = await db
      .select()
      .from(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.token, hashedToken),
          gt(refreshTokensTable.expiresAt, new Date())
        )
      )
      .limit(1)

    const storedToken = tokens[0]

    if (!storedToken) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' })
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, storedToken.userId), isNull(usersTable.deletedAt)))
      .limit(1)

    const user = users[0]

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Delete the old refresh token
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, storedToken.id))

    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    }

    const accessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken()
    const hashedNewRefreshToken = hashToken(newRefreshToken)
    const expiresAt = getRefreshTokenExpiry()

    await db.insert(refreshTokensTable).values({
      userId: user.id,
      token: hashedNewRefreshToken,
      expiresAt,
    })

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
    })
  } catch (error: any) {
    console.error('Token refresh error:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors })
    }
    res.status(500).json({ error: 'Token refresh failed' })
  }
})

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      const hashedToken = hashToken(refreshToken)
      await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, hashedToken))
    }

    res.json({ message: 'Logged out successfully' })
  } catch (error: any) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
})

// GET /api/auth/me - Get current user info (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const users = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        isAdmin: usersTable.isAdmin,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(and(eq(usersTable.id, req.user.userId), isNull(usersTable.deletedAt)))
      .limit(1)

    const user = users[0]

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({ data: user })
  } catch (error: any) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user info' })
  }
})

export default router
