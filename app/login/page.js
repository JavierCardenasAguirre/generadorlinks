'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'No se pudo iniciar sesión')
      toast.success('Sesión iniciada')
      window.location.href = '/dashboard'
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold">Iniciar sesión</h1>
        <input type="email" required placeholder="Email" className="w-full border rounded-lg px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Contraseña" className="w-full border rounded-lg px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Entrando...' : 'Entrar'}</button>
        <p className="text-sm text-gray-600 text-center">¿No tienes cuenta? <a href="/register" className="text-blue-600">Regístrate</a></p>
      </form>
    </main>
  )
}
