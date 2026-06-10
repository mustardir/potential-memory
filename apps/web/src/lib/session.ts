import { SessionOptions } from 'iron-session'

export interface SessionData {
  userId: string
  email: string
  role: string
  firstName: string
  lastName: string
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'fortress_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  },
}
