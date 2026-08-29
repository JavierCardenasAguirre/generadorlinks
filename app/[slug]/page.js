import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { TEMPLATE_PRESETS, DEFAULT_TEMPLATE } from '@/lib/templates'
import EnlaceCard from '@/components/public/EnlaceCard'
import AvatarImage from '@/components/public/AvatarImage'

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

  const templateKey = user.template && TEMPLATE_PRESETS[user.template] ? user.template : DEFAULT_TEMPLATE
  const template = TEMPLATE_PRESETS[templateKey]

  return (
    <main className={`${template.container} min-h-screen p-6`}>
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center mb-8">
          <AvatarImage 
            src={user.avatar_url} 
            nombre={user.nombre} 
          />
          
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