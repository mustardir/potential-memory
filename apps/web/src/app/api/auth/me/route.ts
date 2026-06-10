import { getCurrentUser } from '@/lib/auth'
import { apiSuccess, apiUnauthorized, apiServerError } from '@/lib/api'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return apiUnauthorized()
    return apiSuccess({ user })
  } catch {
    return apiServerError()
  }
}
