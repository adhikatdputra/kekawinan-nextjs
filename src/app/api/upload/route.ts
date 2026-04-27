import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { badRequest, ok, serverError } from '@/lib/api-response'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE_BYTES = 1 * 1024 * 1024 // 1 MB

/**
 * POST /api/upload
 * Multipart form with field: file (image), folder (optional string)
 * Returns: { url: string, publicId: string }
 * Requires: Bearer token
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) return auth

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return badRequest('Invalid multipart form data')
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return badRequest('file field is required')
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return badRequest('Only JPEG, PNG, GIF, and WEBP images are allowed')
  }

  if (file.size > MAX_SIZE_BYTES) {
    return badRequest('File size must not exceed 1MB')
  }

  const folder = (formData.get('folder') as string | null)?.trim() || 'kekawinan/general'

  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const result = await uploadToCloudinary(buffer, folder)

    return ok({ url: result.secureUrl, publicId: result.publicId }, 'File uploaded successfully')
  } catch (err) {
    console.error('[upload] Cloudinary error:', err)
    return serverError('Failed to upload file')
  }
}
