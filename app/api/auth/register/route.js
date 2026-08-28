import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { generateUniqueSlug } from '@/lib/platform'
import { DEFAULT_TEMPLATE } from '@/lib/templates'

export async function POST(request) {
  try {
    const { nombre, email, password } = await request.json()

    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const { data: existing } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', normalizedEmail)
      .limit(1)

    if (existing?.length) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 409 })
    }

    const { count, error: countError } = await supabaseAdmin
      .from('usuarios')
      .select('id', { count: 'exact', head: true })

    if (countError) throw countError

    const isFirstUser = (count || 0) === 0
    const slug = await generateUniqueSlug(nombre)
    const passwordHash = await bcrypt.hash(password, 10)

    const { data: createdUser, error: createError } = await supabaseAdmin
      .from('usuarios')
      .insert({
        nombre: nombre.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        slug,
        role: isFirstUser ? 'admin' : 'user',
        approved: isFirstUser,
        template: DEFAULT_TEMPLATE,
        bio: ''
      })
      .select('*')
      .single()

    if (createError) throw createError

    const now = Date.now()
    const trialEnd = new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { error: subError } = await supabaseAdmin
      .from('suscripciones')
      .insert({
        usuario_id: createdUser.id,
        status: 'trial',
        trial_ends_at: trialEnd,
        current_period_ends_at: trialEnd,
        monthly_price_usd: 3
      })

    if (subError) throw subError

    return NextResponse.json({
      success: true,
      approved: createdUser.approved,
      message: createdUser.approved
        ? 'Cuenta creada exitosamente. Ya puedes iniciar sesión.'
        : 'Cuenta creada. Debe ser aprobada por un administrador antes de iniciar sesión.'
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error inesperado al registrar usuario' }, { status: 500 })
  }
}
