import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/jwt'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { badRequest, ok, serverError } from '@/lib/api-response'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/aac']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES]
const MAX_IMAGE_SIZE_BYTES = 1 * 1024 * 1024   // 1 MB
const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024  // 10 MB

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
    return badRequest('Only JPEG, PNG, GIF, WEBP images and MP3, OGG, WAV, AAC audio files are allowed')
  }

  const isAudio = ALLOWED_AUDIO_TYPES.includes(file.type)
  const maxSize = isAudio ? MAX_AUDIO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES
  if (file.size > maxSize) {
    return badRequest(`File size must not exceed ${isAudio ? '10MB' : '1MB'}`)
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
