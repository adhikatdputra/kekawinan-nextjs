import { NextResponse } from 'next/server'

type ApiResponse<T = unknown> = {
  success: boolean
  data: T | ''
  message: string
  code: number
}

export const ok = <T>(data: T, message = 'Success') =>
  NextResponse.json<ApiResponse<T>>({ success: true, data, message, code: 200 }, { status: 200 })

export const created = <T>(data: T, message = 'Created') =>
  NextResponse.json<ApiResponse<T>>({ success: true, data, message, code: 201 }, { status: 201 })

export const badRequest = (message: string) =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 400 }, { status: 400 })

export const unauthorized = (message = 'Unauthorized') =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 401 }, { status: 401 })

export const forbidden = (message = 'Forbidden') =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 403 }, { status: 403 })

export const notFound = (message = 'Not found') =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 404 }, { status: 404 })

export const conflict = (message: string) =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 409 }, { status: 409 })

export const serverError = (message = 'Internal server error') =>
  NextResponse.json<ApiResponse>({ success: false, data: '', message, code: 500 }, { status: 500 })
