import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function PATCH(request, { params }) {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { id } = params
    const payload = await request.json()
    const updates = {
      updated_at: new Date().toISOString()
    }

    if (typeof payload.titulo === 'string') updates.titulo = payload.titulo.trim()
    if (typeof payload.url === 'string') updates.url = payload.url.trim()
    if (typeof payload.tipo === 'string') updates.tipo = payload.tipo
    if (typeof payload.estado === 'boolean') updates.estado = payload.estado
    if (typeof payload.orden === 'number') updates.orden = payload.orden

    const { data, error } = await supabaseAdmin
      .from('enlaces')
      .update(updates)
      .eq('id', id)
      .eq('usuario_id', user.id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ link: data })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al actualizar enlace' }, { status: 500 })
  }
}

export async function DELETE(_request, { params }) {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { id } = params
    const { error } = await supabaseAdmin
      .from('enlaces')
      .delete()
      .eq('id', id)
      .eq('usuario_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al eliminar enlace' }, { status: 500 })
  }
}
