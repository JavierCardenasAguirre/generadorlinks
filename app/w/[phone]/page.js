'use client'

import { useMemo, useState, useEffect } from 'react'

function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

export default function WhatsAppBridgePage({ params, searchParams }) {
  const phone = sanitizePhone(params?.phone)
  const message = searchParams?.text || 'Hola, me interesa tu producto'
  const [copied, setCopied] = useState(false)
  const [isTikTok, setIsTikTok] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es TikTok
    const userAgent = navigator.userAgent || navigator.vendor || window.opera
    const isTikTokWebView = /TikTok/i.test(userAgent) || document.referrer?.includes('tiktok')
    setIsTikTok(isTikTokWebView)

    // Detectar si es móvil
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(userAgent)
    setIsMobile(isMobileDevice)

    // Si es TikTok, intentar abrir directamente después de un pequeño delay
    if (isTikTokWebView && isMobileDevice) {
      setTimeout(() => {
        // Primero intentar con WhatsApp API (funciona en TikTok)
        const encodedText = encodeURIComponent(message)
        const apiUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedText}&type=phone_number&app_absent=0`
        window.location.href = apiUrl
      }, 100)
    }
  }, [phone, message])

  const links = useMemo(() => {
    const encodedText = encodeURIComponent(message)
    const waMe = `https://wa.me/${phone}?text=${encodedText}`
    const apiUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodedText}&type=phone_number&app_absent=0`
    const schemeUrl = `whatsapp://send?phone=${phone}&text=${encodedText}`
    const intentUrl = `intent://send?phone=${phone}&text=${encodedText}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(waMe)};end`
    const fallbackUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`
    
    return { waMe, apiUrl, schemeUrl, intentUrl, fallbackUrl }
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

  // Función mejorada para abrir WhatsApp
  const openWhatsApp = () => {
    // Si es TikTok, usar la URL de la API que funciona mejor
    if (isTikTok) {
      window.location.href = links.apiUrl
      return
    }

    // En Android, intentar con intent primero
    if (/Android/i.test(navigator.userAgent)) {
      // Intentar abrir con intent
      const intentLink = links.intentUrl
      window.location.href = intentLink

      // Fallback después de 2 segundos si no se abrió
      setTimeout(() => {
        // Si la página sigue visible, usar el fallback
        if (!document.hidden) {
          window.location.href = links.apiUrl
        }
      }, 2000)
      return
    }

    // En iOS, usar scheme primero
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = links.schemeUrl
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = links.apiUrl
        }
      }, 2000)
      return
    }

    // En desktop, abrir con API
    window.open(links.apiUrl, '_blank')
  }

  // Función específica para TikTok
  const openForTikTok = () => {
    window.location.href = links.apiUrl
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
        
        {/* Botón principal mejorado */}
        <button 
          onClick={openWhatsApp}
          className="block w-full rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 text-lg shadow-lg transition-colors"
        >
          {isTikTok ? 'Abrir en WhatsApp (TikTok)' : 'Abrir WhatsApp'}
        </button>

        {/* Botón especial para TikTok */}
        {isTikTok && (
          <button 
            onClick={openForTikTok}
            className="block w-full rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 mt-3 transition-colors"
          >
            Abrir con API (Recomendado para TikTok)
          </button>
        )}

        <a 
          href={links.apiUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-4 mt-3 text-center transition-colors"
        >
          Abrir por navegador
        </a>
        
        <button 
          type="button" 
          onClick={copyFallback}
          className="block w-full rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold py-3 px-4 mt-3 transition-colors"
        >
          {copied ? 'Enlace copiado ✅' : 'Copiar enlace'}
        </button>

        <div className="mt-5 rounded-xl bg-amber-50 border border-amber-300 p-3 text-left text-sm text-amber-900">
          <p className="font-bold mb-1">📱 Si vienes desde TikTok</p>
          <p className="mb-2">Usa el botón <span className="font-bold">&quot;Abrir con API&quot;</span> o el botón principal (funciona automáticamente).</p>
          <ol className="list-decimal ml-5 space-y-1">
            <li>Toca el botón verde o azul para abrir WhatsApp</li>
            <li>Si no funciona, copia el enlace y pégalo en tu navegador</li>
          </ol>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          <p>Número: +{phone}</p>
          {isTikTok && <p className="text-green-600 font-bold">✓ Modo TikTok detectado</p>}
        </div>
      </div>
    </main>
  )
}