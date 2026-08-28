import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { DEFAULT_TEMPLATE, TEMPLATE_PRESETS } from '@/lib/templates'
import { getPublicUserPayload } from '@/lib/platform'

export async function PATCH(request) {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const body = await request.json()
    const updates = {}

    if (typeof body.nombre === 'string') updates.nombre = body.nombre.trim()
    if (typeof body.bio === 'string') updates.bio = body.bio.slice(0, 180)
    if (typeof body.avatar_url === 'string') updates.avatar_url = body.avatar_url.trim()

    if (typeof body.template === 'string') {
      updates.template = TEMPLATE_PRESETS[body.template] ? body.template : DEFAULT_TEMPLATE
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No hay cambios para guardar' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ user: getPublicUserPayload(data) })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al actualizar perfil' }, { status: 500 })
  }
}
