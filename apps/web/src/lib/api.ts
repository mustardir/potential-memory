import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function apiError(message: string, status = 400, errors?: unknown) {
  return NextResponse.json(
    { success: false, error: message, errors },
    { status }
  )
}

export function apiUnauthorized(message = 'Unauthorized') {
  return apiError(message, 401)
}

export function apiForbidden(message = 'Forbidden') {
  return apiError(message, 403)
}

export function apiNotFound(message = 'Not found') {
  return apiError(message, 404)
}

export function apiServerError(message = 'Internal server error') {
  return apiError(message, 500)
}

export function handleZodError(error: ZodError) {
  const errors = error.flatten().fieldErrors
  return apiError('Validation failed', 422, errors)
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
