import { NextRequest, NextResponse } from 'next/server'

interface JwtPayload {
  id: string
  level: string
  exp: number
  fullname?: string
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    // Pad base64url to standard base64
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4)
    const decoded = JSON.parse(atob(padded))
    return decoded as JwtPayload
  } catch {
    return null
  }
}

function isTokenValid(token: string): JwtPayload | null {
  const payload = decodeJwt(token)
  if (!payload) return null
  // Check expiry (exp is in seconds)
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
  return payload
}

function isAdminLevel(level: string): boolean {
  return level === 'admin' || level === 'superadmin'
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('token')?.value
  const payload = token ? isTokenValid(token) : null

  // Protect /user/* routes — any authenticated user
  if (pathname.startsWith('/user/')) {
    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Protect /admin/* routes — admin or superadmin only
  if (pathname.startsWith('/admin/')) {
    if (!payload) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (!isAdminLevel(payload.level)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith('/auth/')) {
    if (payload) {
      const destination = isAdminLevel(payload.level) ? '/admin/undangan' : '/user/undangan-list'
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/user/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
}
