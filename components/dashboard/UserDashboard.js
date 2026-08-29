'use client'

import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { TEMPLATE_PRESETS } from '@/lib/templates'

const initialLink = { titulo: '', url: '', tipo: 'web', estado: true }

export default function UserDashboard() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState(null)
  const [origin, setOrigin] = useState('')
  const [profile, setProfile] = useState({ nombre: '', bio: '', avatar_url: '', template: 'neonPulse' })
  const [newLink, setNewLink] = useState(initialLink)

  const fetchMe = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/me')
      if (!res.ok) throw new Error('No se pudo cargar tu cuenta')
      const payload = await res.json()
      setData(payload)
      setProfile({
        nombre: payload.user.nombre || '',
        bio: payload.user.bio || '',
        avatar_url: payload.user.avatar_url || '',
        template: payload.user.template || 'neonPulse'
      })
    } catch (error) {
      toast.error(error.message)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setOrigin(window.location.origin)
    fetchMe()
  }, [])

  const subscriptionText = useMemo(() => {
    if (!data?.subscription) return 'Sin suscripción registrada'

    if (data.user.lifetime_access) {
      return 'Licencia vitalicia activa por decisión del administrador'
    }

    if (!data.user.billing_enabled) {
      return 'Cobro deshabilitado por el administrador (acceso activo sin vencimiento)'
    }

    const sub = data.subscription
    if (sub.status === 'trial') return `Prueba gratuita hasta ${new Date(sub.trial_ends_at).toLocaleDateString()}`
    if (sub.status === 'active' && sub.current_period_ends_at) return `Activa hasta ${new Date(sub.current_period_ends_at).toLocaleDateString()}`
    return 'Pago pendiente ($3/mes)'
  }, [data])

  const canUserPay = useMemo(() => {
    if (!data) return false
    return data.user.billing_enabled && !data.user.lifetime_access
  }, [data])

  const saveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo actualizar el perfil')
      toast.success('Perfil actualizado')
      await fetchMe()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const addLink = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLink)
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo crear el enlace')
      setNewLink(initialLink)
      toast.success('Enlace agregado')
      await fetchMe()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const removeLink = async (id) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo eliminar el enlace')
      toast.success('Enlace eliminado')
      await fetchMe()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const activateSubscription = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/subscription/checkout', { method: 'POST' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo activar la suscripción')
      toast.success(payload.message)
      await fetchMe()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  const publicUrl = origin ? `${origin}/${data.user.slug}` : `/${data.user.slug}`

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Hola, {data.user.nombre}</h1>
            <p className="text-sm text-gray-600">{subscriptionText}</p>
            <p className="text-sm mt-2">Tu URL pública: <a className="text-blue-600" href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
          </div>
          <div className="flex gap-2">
            {canUserPay && (
              <button onClick={activateSubscription} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Activar plan $3/mes
              </button>
            )}
            {data.user.role === 'admin' && (
              <a href="/admin" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Panel admin</a>
            )}
            <button onClick={logout} className="px-4 py-2 bg-gray-700 text-white rounded-lg">Salir</button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-lg">Perfil y diseño</h2>
            <input className="w-full border rounded-lg px-3 py-2" value={profile.nombre} onChange={(e) => setProfile({ ...profile, nombre: e.target.value })} placeholder="Nombre" />
            <textarea className="w-full border rounded-lg px-3 py-2" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Biografía" rows={3} />
            <input className="w-full border rounded-lg px-3 py-2" value={profile.avatar_url} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })} placeholder="URL de avatar" />
            <select className="w-full border rounded-lg px-3 py-2" value={profile.template} onChange={(e) => setProfile({ ...profile, template: e.target.value })}>
              {Object.values(TEMPLATE_PRESETS).map((tpl) => (
                <option key={tpl.id} value={tpl.id}>{tpl.name}</option>
              ))}
            </select>
            <button onClick={saveProfile} disabled={saving} className="w-full py-2 rounded-lg bg-blue-600 text-white">Guardar cambios</button>
          </section>

          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Estadísticas</h2>
            <p className="text-3xl font-bold">{data.totalClicks}</p>
            <p className="text-sm text-gray-500 mb-4">Clicks totales</p>
            <div className="space-y-2">
              {data.clicksByDay.slice(-7).map((item) => (
                <div key={item.date} className="flex justify-between text-sm border-b pb-1">
                  <span>{item.date}</span>
                  <span>{item.total}</span>
                </div>
              ))}
              {data.clicksByDay.length === 0 && <p className="text-sm text-gray-500">Aún no hay clicks registrados.</p>}
            </div>
          </section>
        </div>

        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Enlaces</h2>
          <form onSubmit={addLink} className="grid md:grid-cols-4 gap-3 mb-4">
            <input required className="border rounded-lg px-3 py-2" placeholder="Título" value={newLink.titulo} onChange={(e) => setNewLink({ ...newLink, titulo: e.target.value })} />
            <input required className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
            <button disabled={saving} className="bg-blue-600 text-white rounded-lg px-3 py-2">Agregar</button>
          </form>
          <div className="space-y-2">
            {data.links.map((link) => (
              <div key={link.id} className="border rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{link.titulo}</p>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
                <button onClick={() => removeLink(link.id)} className="text-red-600">Eliminar</button>
              </div>
            ))}
            {data.links.length === 0 && <p className="text-sm text-gray-500">Agrega tu primer enlace.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}