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

  // Siempre usar pinkCases si no hay template válido
  const templateKey = user.template && TEMPLATE_PRESETS[user.template] ? user.template : DEFAULT_TEMPLATE
  const template = TEMPLATE_PRESETS[templateKey]

  return (
    <main className={`${template.container} min-h-screen p-6`}>
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center mb-8">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.nombre}
              className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-4 border-white shadow-2xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-white flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-white text-pink-600">
              {user.nombre?.slice(0, 1)?.toUpperCase()}
            </div>
          )}
          
          <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-4">
            {user.nombre}
          </h1>
          
          {user.bio && (
            <p className="mt-3 text-xl font-semibold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] max-w-lg mx-auto leading-relaxed px-4">
              {user.bio}
            </p>
          )}
        </div>

        <div className="space-y-4 mt-10">
          {(links || []).map((link) => (
            <EnlaceCard key={link.id} enlace={link} href={`/r/${link.id}`} variantClass={template.card} />
          ))}
        </div>
      </div>
    </main>
  )
}