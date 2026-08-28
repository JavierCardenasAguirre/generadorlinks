import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createSession } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { getPublicUserPayload, syncSubscriptionStatus } from '@/lib/platform'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios' }, { status: 400 })
    }

    const { data: user, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', String(email).toLowerCase().trim())
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const validPassword = user.password_hash
      ? await bcrypt.compare(password, user.password_hash)
      : false

    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    if (!user.approved && user.role !== 'admin') {
      return NextResponse.json({ error: 'Tu cuenta está pendiente de aprobación del administrador' }, { status: 403 })
    }

    await createSession(user.id)
    const subscription = await syncSubscriptionStatus(user.id)

    return NextResponse.json({
      success: true,
      user: getPublicUserPayload(user),
      subscription
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error inesperado al iniciar sesión' }, { status: 500 })
  }
}
