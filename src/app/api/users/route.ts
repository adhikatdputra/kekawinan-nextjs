import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/prisma'
import { created, badRequest, conflict, serverError } from '@/lib/api-response'

// POST /api/users — register
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullname, password, phone, dob } = body

    // Validate required fields
    if (!email || !fullname || !password) {
      return badRequest('Email, fullname, and password are required')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest('Invalid email format')
    }
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!PASSWORD_REGEX.test(password)) {
      return badRequest('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return conflict('Email is already taken')
    }

    const user = await prisma.user.create({
      data: {
        id: nanoid(),
        email,
        fullname,
        password: await bcrypt.hash(password, 10),
        level: 'user', // hardcoded — level cannot be set by client
        phone: phone ?? null,
        dob: dob ? new Date(dob) : null,
      },
      select: {
        id: true,
        email: true,
        fullname: true,
        level: true,
        phone: true,
        dob: true,
        createdAt: true,
      },
    })

    // Activate any pending collaborator invites for this email
    await prisma.undanganCollaborator.updateMany({
      where: { email, status: 'PENDING' },
      data: { userId: user.id, status: 'ACTIVE', joinedAt: new Date() },
    })

    return created(user, 'Register success')
  } catch {
    return serverError()
  }
}
