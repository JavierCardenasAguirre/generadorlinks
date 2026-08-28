import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre, email, role, approved, slug, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ users: data || [] })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al listar usuarios' }, { status: 500 })
  }
}
