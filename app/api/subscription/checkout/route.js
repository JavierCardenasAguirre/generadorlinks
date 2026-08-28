import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const now = new Date()
    const nextBilling = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabaseAdmin
      .from('suscripciones')
      .upsert({
        usuario_id: user.id,
        status: 'active',
        current_period_starts_at: now.toISOString(),
        current_period_ends_at: nextBilling,
        monthly_price_usd: 3,
        updated_at: now.toISOString()
      }, { onConflict: 'usuario_id' })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Suscripción activada por 1 mes ($3 USD).',
      subscription: data
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al activar suscripción' }, { status: 500 })
  }
}
