import { supabaseAdmin } from '@/lib/supabase/admin'
import { DEFAULT_TEMPLATE, TEMPLATE_PRESETS } from '@/lib/templates'

export function slugify(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'usuario'
}

export async function generateUniqueSlug(baseValue) {
  const base = slugify(baseValue)
  let candidate = base
  let index = 1

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('slug', candidate)
      .limit(1)

    if (error) throw error
    if (!data || data.length === 0) return candidate

    index += 1
    candidate = `${base}-${index}`
  }
}

export async function syncSubscriptionStatus(usuarioId) {
  const { data: userFlags, error: userFlagsError } = await supabaseAdmin
    .from('usuarios')
    .select('billing_enabled, lifetime_access')
    .eq('id', usuarioId)
    .single()

  if (userFlagsError || !userFlags) return null

  if (userFlags.lifetime_access) {
    return {
      status: 'active',
      is_lifetime: true,
      billing_enabled: userFlags.billing_enabled,
      current_period_ends_at: null
    }
  }

  if (!userFlags.billing_enabled) {
    return {
      status: 'active',
      is_payment_disabled: true,
      billing_enabled: false,
      current_period_ends_at: null
    }
  }

  const { data: sub } = await supabaseAdmin
    .from('suscripciones')
    .select('*')
    .eq('usuario_id', usuarioId)
    .single()

  if (!sub) return null

  const now = Date.now()
  let nextStatus = sub.status

  if (sub.status === 'trial' && sub.trial_ends_at && new Date(sub.trial_ends_at).getTime() < now) {
    nextStatus = 'past_due'
  }

  if (sub.status === 'active' && sub.current_period_ends_at && new Date(sub.current_period_ends_at).getTime() < now) {
    nextStatus = 'past_due'
  }

  if (nextStatus !== sub.status) {
    const { data: updated } = await supabaseAdmin
      .from('suscripciones')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', sub.id)
      .select('*')
      .single()

    return { ...(updated || { ...sub, status: nextStatus }), ...userFlags }
  }

  return { ...sub, ...userFlags }
}

export function getPublicUserPayload(userRow) {
  const safeTemplate = TEMPLATE_PRESETS[userRow.template] ? userRow.template : DEFAULT_TEMPLATE

  return {
    id: userRow.id,
    nombre: userRow.nombre,
    email: userRow.email,
    slug: userRow.slug,
    role: userRow.role,
    approved: userRow.approved,
    billing_enabled: userRow.billing_enabled ?? true,
    lifetime_access: userRow.lifetime_access ?? false,
    bio: userRow.bio || '',
    avatar_url: userRow.avatar_url || '',
    template: safeTemplate
  }
}