import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request) {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { titulo, url, tipo = 'web', estado = true } = await request.json()

    if (!titulo || !url) {
      return NextResponse.json({ error: 'Título y URL son obligatorios' }, { status: 400 })
    }

    const { count } = await supabaseAdmin
      .from('enlaces')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', user.id)

    const { data, error } = await supabaseAdmin
      .from('enlaces')
      .insert({
        usuario_id: user.id,
        titulo: titulo.trim(),
        url: url.trim(),
        tipo,
        estado,
        orden: count || 0
      })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({ link: data })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al crear enlace' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('enlaces')
      .select('*')
      .eq('usuario_id', user.id)
      .order('orden', { ascending: true })

    if (error) throw error
    return NextResponse.json({ links: data || [] })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al listar enlaces' }, { status: 500 })
  }
}
