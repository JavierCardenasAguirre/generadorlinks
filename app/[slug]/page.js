import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/admin'
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

  // TEMPLATE FORZADO - siempre rosa
  const containerClasses = 'min-h-screen bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 text-white p-6'
  const cardClasses = 'bg-white hover:bg-gray-50 text-gray-900 font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-4 border-black/20'

  return (
    <main className={containerClasses}>
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center mb-8">
          <AvatarImage src={user.avatar_url} nombre={user.nombre} />
          
          <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mb-4">
            {user.nombre}
          </h1>
          
          {user.bio && (
            <p className="mt-3 text-xl font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.9)] max-w-lg mx-auto leading-relaxed px-4">
              {user.bio}
            </p>
          )}
        </div>

        <div className="space-y-4 mt-10">
          {(links || []).map((link) => (
            <EnlaceCard key={link.id} enlace={link} href={`/r/${link.id}`} variantClass={cardClasses} />
          ))}
        </div>
      </div>
    </main>
  )
}