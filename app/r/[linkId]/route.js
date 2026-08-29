import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request, { params }) {
  try {
    const { linkId } = params

    const { data: link, error } = await supabaseAdmin
      .from('enlaces')
      .select('id, url, usuario_id, estado')
      .eq('id', linkId)
      .single()

    if (error || !link || !link.estado) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : null
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await supabaseAdmin.from('click_stats').insert({
      enlace_id: link.id,
      usuario_id: link.usuario_id,
      ip,
      user_agent: userAgent,
      clicked_at: new Date().toISOString()
    })

    return NextResponse.redirect(link.url)
  } catch (_error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
