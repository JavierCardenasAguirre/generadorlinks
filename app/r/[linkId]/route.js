import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

function extractWhatsAppTarget(rawUrl) {
  try {
    const parsed = new URL(rawUrl)
    const host = parsed.hostname.toLowerCase()

    let phone = ''
    let text = parsed.searchParams.get('text') || ''

    if (host === 'wa.me' || host === 'www.wa.me') {
      phone = parsed.pathname.replaceAll('/', '').replace(/\D/g, '')
    }

    if (host.includes('whatsapp.com')) {
      const phoneFromQuery = parsed.searchParams.get('phone') || ''
      if (phoneFromQuery) {
        phone = phoneFromQuery.replace(/\D/g, '')
      }

      if (!text) {
        text = parsed.searchParams.get('text') || ''
      }
    }

    if (!phone) {
      return null
    }

    return { phone, text }
  } catch (_err) {
    return null
  }
}

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

    const waTarget = extractWhatsAppTarget(link.url)
    if (waTarget) {
      const destination = new URL(`/w/${waTarget.phone}`, request.url)
      if (waTarget.text) {
        destination.searchParams.set('text', waTarget.text)
      }
      return NextResponse.redirect(destination)
    }

    return NextResponse.redirect(link.url)
  } catch (_error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}