import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { verifyRefreshToken, signAccessToken, signRefreshToken, decodeToken } from '@/lib/jwt'
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return badRequest('Refresh token is required')
    }

    let decoded
    try {
      decoded = verifyRefreshToken(refresh_token)
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        return unauthorized('Refresh token expired')
      }
      return unauthorized('Invalid refresh token')
    }

    const tokenPayload = { id: decoded.id, level: decoded.level, fullname: decoded.fullname ?? '' }
    const token = signAccessToken(tokenPayload)
    const new_refresh_token = signRefreshToken(tokenPayload)

    return ok({
      token,
      exp_token: decodeToken(token).exp,
      refresh_token: new_refresh_token,
      exp_refresh_token: decodeToken(new_refresh_token).exp,
    }, 'Refresh token success')
  } catch {
    return serverError()
  }
}
