import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth'
import { getPublicUserPayload, syncSubscriptionStatus } from '@/lib/platform'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const user = await requireUser()
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

    const [subscription, linksResult, clicksCountResult, clicksRowsResult] = await Promise.all([
      syncSubscriptionStatus(user.id),
      supabaseAdmin
        .from('enlaces')
        .select('*')
        .eq('usuario_id', user.id)
        .order('orden', { ascending: true }),
      supabaseAdmin
        .from('click_stats')
        .select('id', { count: 'exact', head: true })
        .eq('usuario_id', user.id),
      supabaseAdmin
        .from('click_stats')
        .select('clicked_at')
        .eq('usuario_id', user.id)
        .order('clicked_at', { ascending: false })
        .limit(200)
    ])

    const dailyMap = new Map()
    for (const row of clicksRowsResult.data || []) {
      const day = new Date(row.clicked_at).toISOString().slice(0, 10)
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1)
    }

    const clicksByDay = Array.from(dailyMap.entries())
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      user: getPublicUserPayload(user),
      links: linksResult.data || [],
      subscription,
      totalClicks: clicksCountResult.count || 0,
      clicksByDay
    })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error al cargar perfil' }, { status: 500 })
  }
}
