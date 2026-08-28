import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(_request, { params }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id: usuarioId } = params
    const now = new Date()
    const until = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabaseAdmin
      .from('suscripciones')
      .upsert({
        usuario_id: usuarioId,
        status: 'active',
        current_period_starts_at: now.toISOString(),
        current_period_ends_at: until,
        monthly_price_usd: 3,
        updated_at: now.toISOString()
      }, { onConflict: 'usuario_id' })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, subscription: data })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al activar suscripción' }, { status: 500 })
  }
}
