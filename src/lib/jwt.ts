import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import { unauthorized } from './api-response'

const ACCESS_SECRET = process.env.SECRET_KEY_JWT!
const REFRESH_SECRET = process.env.SECRET_KEY_JWT_REFRESH!
const ISSUER = 'CTRL Spark'

export interface JwtPayload {
  id: string
  level: string
  fullname?: string
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { issuer: ISSUER, expiresIn: '30d' })
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { issuer: ISSUER, expiresIn: '90d' })
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, ACCESS_SECRET, { issuer: ISSUER }) as JwtPayload
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, REFRESH_SECRET, { issuer: ISSUER }) as JwtPayload
}

export function decodeToken(token: string): JwtPayload & { exp: number } {
  return jwt.decode(token) as JwtPayload & { exp: number }
}

/** Returns true if the level is admin or superadmin. */
export function isAdminLevel(level: string): boolean {
  return level === 'admin' || level === 'superadmin'
}

/**
 * Extract and verify the Bearer token from a request.
 * Returns the decoded payload or a NextResponse (401) to return immediately.
 */
export function requireAuth(request: NextRequest): JwtPayload | NextResponse {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized('No token provided')
  }
  const token = authHeader.split(' ')[1]
  try {
    return verifyAccessToken(token)
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return unauthorized('Access token expired')
    }
    return unauthorized('Invalid token')
  }
}
