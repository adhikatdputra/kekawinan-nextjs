import { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { signAccessToken, signRefreshToken, decodeToken } from '@/lib/jwt'
import { ok, badRequest, unauthorized, forbidden, serverError } from '@/lib/api-response'

interface GoogleTokenInfo {
  aud?: string
}

interface GoogleUserInfo {
  email?: string
  email_verified?: boolean
  name?: string
}

/**
 * Checks an access token from the GIS token client. tokeninfo confirms the token was
 * issued to our client ID (so a token minted for another app can't be replayed here),
 * then userinfo returns the profile.
 */
async function getGoogleUser(accessToken: string, clientId: string): Promise<GoogleUserInfo | null> {
  const tokenRes = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`,
    { cache: 'no-store' }
  )
  if (!tokenRes.ok) return null
  const tokenInfo: GoogleTokenInfo = await tokenRes.json()
  if (tokenInfo.aud !== clientId) return null

  const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  })
  if (!userRes.ok) return null
  return userRes.json()
}

// POST /api/auth/google — sign in or sign up with an access token from the Google Identity Services token client
export async function POST(request: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  if (!clientId) return serverError('Login Google belum dikonfigurasi')

  try {
    const { access_token } = await request.json()
    if (!access_token || typeof access_token !== 'string') {
      return badRequest('Google access token is required')
    }

    const payload = await getGoogleUser(access_token, clientId)
    if (!payload) {
      return unauthorized('Google token is invalid')
    }

    // Only trust emails Google has verified, otherwise anyone could claim an existing account
    if (!payload.email || payload.email_verified !== true) {
      return unauthorized('Email Google belum terverifikasi')
    }
    const email = payload.email.toLowerCase()

    // Older accounts may have been registered with mixed-case emails
    let user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, email: true, fullname: true, level: true, status: true },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: nanoid(),
          email,
          fullname: payload.name?.slice(0, 255) || email.split('@')[0],
          // No password until the user sets one from the profile page or "Lupa password"
          password: null,
          level: 'user',
        },
        select: { id: true, email: true, fullname: true, level: true, status: true },
      })

      // Activate any pending collaborator invites for this email, same as /api/users register
      await prisma.undanganCollaborator.updateMany({
        where: { email, status: 'PENDING' },
        data: { userId: user.id, status: 'ACTIVE', joinedAt: new Date() },
      })
    }

    if (user.status !== 'ACTIVE') {
      return forbidden('Account is not active')
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

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
