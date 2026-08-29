'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudieron cargar usuarios')
      setUsers(payload.users)
    } catch (error) {
      toast.error(error.message)
      window.location.href = '/dashboard'
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateApproval = async (userId, approved) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/approval`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved })
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo actualizar el estado')
      toast.success(`Usuario ${approved ? 'aprobado' : 'rechazado'}`)
      await fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const activateSubscription = async (userId) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/subscriptions/${userId}/activate`, { method: 'POST' })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo activar suscripción')
      toast.success('Suscripción activada por 1 mes')
      await fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing(false)
    }
  }

  const updateBillingPolicy = async (userId, billingEnabled, lifetimeAccess) => {
    setProcessing(true)
    try {
      const res = await fetch(`/api/admin/users/${userId}/billing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billing_enabled: billingEnabled,
          lifetime_access: lifetimeAccess
        })
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo actualizar la política de pago')
      toast.success('Política de pago actualizada')
      await fetchUsers()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="p-6">Cargando usuarios...</div>

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Administración</h1>
          <a href="/dashboard" className="text-blue-600">Volver al dashboard</a>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Nombre</th>
                <th className="py-2">Email</th>
                <th className="py-2">Rol</th>
                <th className="py-2">Aprobado</th>
                <th className="py-2">Cobro</th>
                <th className="py-2">Licencia vitalicia</th>
                <th className="py-2">URL</th>
                <th className="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b align-top">
                  <td className="py-2 font-medium">{user.nombre}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">{user.role}</td>
                  <td className="py-2">{user.approved ? 'Sí' : 'No'}</td>
                  <td className="py-2">{user.billing_enabled ? 'Habilitado' : 'Deshabilitado'}</td>
                  <td className="py-2">{user.lifetime_access ? 'Sí' : 'No'}</td>
                  <td className="py-2"><a className="text-blue-600" target="_blank" href={`/${user.slug}`}>/{user.slug}</a></td>
                  <td className="py-2">
                    <div className="flex flex-wrap gap-2">
                      {!user.approved && user.role !== 'admin' && (
                        <button disabled={processing} onClick={() => updateApproval(user.id, true)} className="px-2 py-1 bg-green-600 text-white rounded">Aprobar</button>
                      )}
                      {user.approved && user.role !== 'admin' && (
                        <button disabled={processing} onClick={() => updateApproval(user.id, false)} className="px-2 py-1 bg-yellow-600 text-white rounded">Revertir</button>
                      )}

                      {user.role !== 'admin' && (
                        <>
                          <button
                            disabled={processing}
                            onClick={() => updateBillingPolicy(user.id, !user.billing_enabled, user.lifetime_access)}
                            className={`px-2 py-1 text-white rounded ${user.billing_enabled ? 'bg-rose-600' : 'bg-emerald-600'}`}
                          >
                            {user.billing_enabled ? 'Deshabilitar cobro' : 'Habilitar cobro'}
                          </button>

                          <button
                            disabled={processing}
                            onClick={() => updateBillingPolicy(user.id, user.billing_enabled, !user.lifetime_access)}
                            className={`px-2 py-1 text-white rounded ${user.lifetime_access ? 'bg-gray-700' : 'bg-purple-700'}`}
                          >
                            {user.lifetime_access ? 'Quitar vitalicio' : 'Activar vitalicio'}
                          </button>

                          <button
                            disabled={processing || !user.billing_enabled}
                            onClick={() => activateSubscription(user.id)}
                            className="px-2 py-1 bg-indigo-600 text-white rounded disabled:opacity-50"
                          >
                            Activar $3/mes
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}