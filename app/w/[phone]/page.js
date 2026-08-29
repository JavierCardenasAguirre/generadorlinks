'use client'

import { useMemo, useState } from 'react'

function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

export default function WhatsAppBridgePage({ params, searchParams }) {
  const phone = sanitizePhone(params?.phone)
  const message = searchParams?.text || 'Hola, me interesa tu producto'
  const [copied, setCopied] = useState(false)

  const links = useMemo(() => {
    const encodedText = encodeURIComponent(message)
    const waMe = `https://wa.me/${phone}?text=${encodedText}`
    const apiUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedText}&type=phone_number&app_absent=0`
    const schemeUrl = `whatsapp://send?phone=${phone}&text=${encodedText}`
    const intentUrl = `intent://send?phone=${phone}&text=${encodedText}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(waMe)};end`

    return { waMe, apiUrl, schemeUrl, intentUrl }
  }, [phone, message])

  const copyFallback = async () => {
    try {
      await navigator.clipboard.writeText(links.waMe)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      setCopied(false)
    }
  }

  if (!phone) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-950 text-white p-6">
        <div className="max-w-md w-full rounded-2xl bg-white/10 border border-white/20 p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Enlace inválido</h1>
          <p className="text-white/85">No se encontró un número de WhatsApp válido.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-3xl bg-white p-7 shadow-2xl text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Contactar por WhatsApp</h1>
        <p className="text-slate-600 mb-5">Toca el botón principal para abrir el chat.</p>

        <a
          href={links.schemeUrl}
          className="block w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 text-lg shadow-lg"
        >
          Abrir WhatsApp
        </a>

        <a
          href={links.intentUrl}
          className="block w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 mt-3"
        >
          Android: abrir con intent
        </a>

        <a
          href={links.apiUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-4 mt-3"
        >
          Abrir por navegador
        </a>

        <button
          type="button"
          onClick={copyFallback}
          className="block w-full rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold py-3 px-4 mt-3"
        >
          {copied ? 'Enlace copiado' : 'Copiar enlace'}
        </button>

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-300 p-3 text-left text-sm text-amber-900">
          <p className="font-bold mb-1">Si vienes desde TikTok</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Toca el menú de tres puntos en la esquina superior derecha.</li>
            <li>Selecciona Abrir en navegador.</li>
            <li>Luego presiona Abrir WhatsApp.</li>
          </ol>
        </div>

        <p className="text-xs text-slate-500 mt-4">Número: +{phone}</p>
      </div>
    </main>
  )
}