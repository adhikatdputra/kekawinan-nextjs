import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  publicId: string
  url: string
  secureUrl: string
  resourceType: string
  format: string
  bytes: number
  width?: number
  height?: number
}

/**
 * Upload a file from a Buffer or base64 data URI to Cloudinary.
 * @param data  Buffer or base64 data URI string
 * @param folder  Cloudinary folder path (e.g. 'kekawinan/profile')
 * @param publicId  Optional stable public ID (overwrite: true)
 */
export async function uploadToCloudinary(
  data: Buffer | string,
  folder: string,
  publicId?: string,
): Promise<UploadResult> {
  const source =
    Buffer.isBuffer(data)
      ? `data:application/octet-stream;base64,${data.toString('base64')}`
      : data

  const result = await cloudinary.uploader.upload(source, {
    folder,
    public_id: publicId,
    use_filename: !publicId,
    unique_filename: !publicId,
    overwrite: !!publicId,
    resource_type: 'auto',
  })

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
    resourceType: result.resource_type,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
  }
}

/**
 * Delete a file from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image',
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
}
