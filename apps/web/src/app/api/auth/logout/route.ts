import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, SessionData } from '@/lib/session'
import { apiSuccess, apiServerError } from '@/lib/api'

export async function POST() {
  try {
    const cookieStore = cookies()
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
    session.destroy()
    return apiSuccess({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('[LOGOUT]', error)
    return apiServerError()
  }
}
