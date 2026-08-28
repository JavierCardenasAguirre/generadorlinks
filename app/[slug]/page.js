import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { TEMPLATE_PRESETS, DEFAULT_TEMPLATE } from '@/lib/templates'
import EnlaceCard from '@/components/public/EnlaceCard'

export default async function PublicProfilePage({ params }) {
  const { slug } = params

  const { data: user, error } = await supabaseAdmin
    .from('usuarios')
    .select('id, nombre, slug, bio, avatar_url, approved, template')
    .eq('slug', slug)
    .single()

  if (error || !user || !user.approved) {
    notFound()
  }

  const { data: links } = await supabaseAdmin
    .from('enlaces')
    .select('id, titulo, url, tipo, estado')
    .eq('usuario_id', user.id)
    .eq('estado', true)
    .order('orden', { ascending: true })

  const template = TEMPLATE_PRESETS[user.template] || TEMPLATE_PRESETS[DEFAULT_TEMPLATE]

  return (
    <main className={`${template.container} p-6`}>
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center mb-8">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={`Avatar de ${user.nombre}`}
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4 border-4 border-white/30"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.nombre?.slice(0, 1)?.toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold">{user.nombre}</h1>
          {user.bio && <p className="mt-2 opacity-90">{user.bio}</p>}
        </div>

        <div className="space-y-3">
          {(links || []).map((link) => (
            <EnlaceCard key={link.id} enlace={link} href={`/r/${link.id}`} variantClass={template.card} />
          ))}
        </div>
      </div>
    </main>
  )
}
