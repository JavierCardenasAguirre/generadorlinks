import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id } = params
    const { billing_enabled, lifetime_access } = await request.json()

    if (typeof billing_enabled !== 'boolean' || typeof lifetime_access !== 'boolean') {
      return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
    }

    const { data: targetUser, error: userError } = await supabaseAdmin
      .from('usuarios')
      .select('id, role')
      .eq('id', id)
      .single()

    if (userError || !targetUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    if (targetUser.role === 'admin' && targetUser.id !== admin.id) {
      return NextResponse.json({ error: 'No puedes modificar la facturación de otro administrador' }, { status: 403 })
    }

    const nowIso = new Date().toISOString()

    const { error: updateUserError } = await supabaseAdmin
      .from('usuarios')
      .update({ billing_enabled, lifetime_access, updated_at: nowIso })
      .eq('id', id)

    if (updateUserError) throw updateUserError

    if (lifetime_access || !billing_enabled) {
      await supabaseAdmin
        .from('suscripciones')
        .upsert({
          usuario_id: id,
          status: 'active',
          current_period_starts_at: nowIso,
          current_period_ends_at: null,
          monthly_price_usd: 3,
          updated_at: nowIso
        }, { onConflict: 'usuario_id' })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al actualizar facturación' }, { status: 500 })
  }
}