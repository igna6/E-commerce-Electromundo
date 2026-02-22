import { and, eq, isNull, gt } from 'drizzle-orm'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import db from '../db/db.ts'
import { usersTable, refreshTokensTable } from '../db/schema.ts'
import config from '../config/config.ts'
import { type JwtPayload } from '../middleware/auth.ts'
import { NotFoundError, UnauthorizedError } from '../utils/errors.ts'

function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions)
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function getRefreshTokenExpiry(): Date {
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

export async function login(email: string, password: string) {
  const users = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)))
    .limit(1)

  const user = users[0]

  if (!user) {
    throw new UnauthorizedError('Invalid credentials')
  }

  const validPassword = await bcrypt.compare(password, user.password)

  if (!validPassword) {
    throw new UnauthorizedError('Invalid credentials')
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

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  }
}

export async function refreshToken(token: string) {
  const hashedToken = hashToken(token)

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
    throw new UnauthorizedError('Invalid or expired refresh token')
  }

  const users = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.id, storedToken.userId), isNull(usersTable.deletedAt)))
    .limit(1)

  const user = users[0]

  if (!user) {
    throw new UnauthorizedError('User not found')
  }

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

  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}

export async function logout(token?: string) {
  if (token) {
    const hashedToken = hashToken(token)
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, hashedToken))
  }
}

export async function getCurrentUser(userId: number) {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      isAdmin: usersTable.isAdmin,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)))
    .limit(1)

  const user = users[0]

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return user
}
