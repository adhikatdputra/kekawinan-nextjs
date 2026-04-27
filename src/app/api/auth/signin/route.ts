import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken, decodeToken } from '@/lib/jwt'
import { ok, badRequest, unauthorized, forbidden, serverError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return badRequest('Email and password are required')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest('Invalid email format')
    }

    // Find user — return generic error to avoid email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return unauthorized('Email or password is wrong')
    }

    // Check account status before verifying password
    if (user.status !== 'ACTIVE') {
      return forbidden('Account is not active')
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return unauthorized('Email or password is wrong')
    }

    // Generate tokens
    const tokenPayload = { id: user.id, level: user.level, fullname: user.fullname ?? '' }
    const token = signAccessToken(tokenPayload)
    const refresh_token = signRefreshToken(tokenPayload)

    return ok({
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      level: user.level,
      token,
      exp_token: decodeToken(token).exp,
      refresh_token,
      exp_refresh_token: decodeToken(refresh_token).exp,
    }, 'Sign in success')
  } catch {
    return serverError()
  }
}
