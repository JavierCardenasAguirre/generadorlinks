import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

const SESSION_COOKIE = 'lt_session'
const SESSION_DAYS = 7

export async function createSession(userId) {
  const token = randomUUID()
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabaseAdmin.from('user_sessions').insert({
    token,
    usuario_id: userId,
    expires_at: expiresAt
  })

  if (error) throw error

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60
  })
}

export async function destroySession() {
  const token = cookies().get(SESSION_COOKIE)?.value

  if (token) {
    await supabaseAdmin.from('user_sessions').delete().eq('token', token)
  }

  cookies().set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  })
}

export async function getSessionUser() {
  const token = cookies().get(SESSION_COOKIE)?.value
  if (!token) return null

  const { data: session, error: sessionError } = await supabaseAdmin
    .from('user_sessions')
    .select('token, expires_at, usuario_id')
    .eq('token', token)
    .single()

  if (sessionError || !session) return null

  if (new Date(session.expires_at).getTime() < Date.now()) {
    await supabaseAdmin.from('user_sessions').delete().eq('token', token)
    return null
  }

  const { data: user, error: userError } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('id', session.usuario_id)
    .single()

  if (userError || !user) return null

  return { token: session.token, user }
}

export async function requireUser() {
  const session = await getSessionUser()
  if (!session?.user) return null
  return session.user
}

export async function requireAdmin() {
  const user = await requireUser()
  if (!user || user.role !== 'admin') return null
  return user
}
