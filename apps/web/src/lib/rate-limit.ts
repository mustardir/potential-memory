// Simple in-memory rate limiter (use Redis in production for multi-instance)
const attempts = new Map<string, { count: number; resetAt: number }>()

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
  const now = Date.now()
  const record = attempts.get(key)

  if (!record || record.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxAttempts - 1, resetAt: now + windowMs }
  }

  if (record.count >= maxAttempts) {
    return { success: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetAt: record.resetAt,
  }
}

export function resetRateLimit(key: string) {
  attempts.delete(key)
}

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, record] of attempts.entries()) {
      if (record.resetAt < now) {
        attempts.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}
