import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function PATCH(request, { params }) {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { id } = params
    const { approved } = await request.json()

    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'El campo approved debe ser booleano' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('usuarios')
      .update({ approved, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al actualizar aprobación' }, { status: 500 })
  }
}
