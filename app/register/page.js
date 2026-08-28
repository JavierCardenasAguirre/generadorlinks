'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo crear la cuenta')
      toast.success(payload.message)
      window.location.href = '/login'
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold">Crear cuenta</h1>
        <input required placeholder="Nombre" className="w-full border rounded-lg px-3 py-2" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input required type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Contraseña (mínimo 6 caracteres)" className="w-full border rounded-lg px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Creando...' : 'Registrarme'}</button>
        <p className="text-sm text-gray-600 text-center">¿Ya tienes cuenta? <a href="/login" className="text-blue-600">Inicia sesión</a></p>
      </form>
    </main>
  )
}
