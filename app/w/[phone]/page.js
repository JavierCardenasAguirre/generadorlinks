'use client'
import { useEffect, useState } from 'react'

export default function WhatsAppPage({ params, searchParams }) {
  const phone = params.phone || ''
  const text = searchParams.text || 'Hola, me interesa tu producto'
  const [copied, setCopied] = useState(false)

  const cleanPhone = phone.replace(/[^\d]/g, '')
  const waUrl = 'https://api.whatsapp.com/send/?phone=' + cleanPhone + '&text=' + encodeURIComponent(text) + '&type=phone_number&app_absent=0'

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isTikTok = ua.includes('TikTok') || ua.includes('musical_ly') || ua.includes('BytedanceWebview')
    if (!isTikTok) {
      setTimeout(() => { window.location.href = waUrl }, 800)
    }
  }, [waUrl])

  const copiar = () => {
    navigator.clipboard.writeText(waUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #25d366, #128c7e)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '40px 32px', maxWidth: '400px', width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        
        <div style={{ width: '80px', height: '80px', background: '#25d366', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111', marginBottom: '8px' }}>
          Contactar por WhatsApp
        </h1>

        <div style={{ background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ fontWeight: '700', color: '#333', marginBottom: '10px' }}>
            ⚠️ Si estas en TikTok:
          </p>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
            1. Toca los <strong>3 puntos (...)</strong> arriba a la derecha
          </p>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
            2. Selecciona <strong>Abrir en navegador</strong>
          </p>
          <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
            3. Luego pulsa el boton verde
          </p>
        </div>

        <a
          href={waUrl}
          style={{ display: 'block', background: '#25d366', color: 'white', fontWeight: '800', fontSize: '18px', padding: '16px', borderRadius: '14px', textDecoration: 'none', marginBottom: '12px', boxShadow: '0 8px 20px rgba(37,211,102,0.4)' }}
        >
          💬 Abrir WhatsApp
        </a>

        <button
          onClick={copiar}
          style={{ width: '100%', background: '#f0f0f0', color: '#333', fontWeight: '600', fontSize: '15px', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer' }}
        >
          {copied ? '✅ Enlace copiado!' : '📋 Copiar enlace'}
        </button>

        <p style={{ color: '#999', fontSize: '12px', marginTop: '16px' }}>
          +{cleanPhone}
        </p>
      </div>
    </main>
  )
}