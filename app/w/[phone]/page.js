'use client'
import { useEffect, useState } from 'react'

export default function WhatsAppPage({ params, searchParams }) {
  const phone = params.phone || ''
  const text = searchParams.text || 'Hola, me interesa tu producto'
  const [status, setStatus] = useState('loading')

  const cleanPhone = phone.replace(/[^\d]/g, '')
  const encodedText = encodeURIComponent(text)

  // URLs para diferentes métodos
  const intentUrl = `intent://send?phone=${cleanPhone}&text=${encodedText}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=https%3A%2F%2Fwa.me%2F${cleanPhone};end`
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`
  const whatsappScheme = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`

  useEffect(() => {
    const ua = navigator.userAgent || ''
    const isAndroid = /android/i.test(ua)
    const isIOS = /iphone|ipad|ipod/i.test(ua)

    setStatus('ready')

    if (isAndroid) {
      // Android: intent:// le dice al OS que abra WhatsApp directamente
      window.location.href = intentUrl
    } else if (isIOS) {
      // iOS: whatsapp:// scheme - el OS lo maneja, no el navegador
      window.location.href = whatsappScheme
      // Fallback si no tiene WhatsApp instalado
      setTimeout(() => {
        window.location.href = waUrl
      }, 2500)
    } else {
      // Desktop
      window.location.href = waUrl
    }
  }, [intentUrl, whatsappScheme, waUrl])

  const abrirManual = () => {
    const ua = navigator.userAgent || ''
    const isAndroid = /android/i.test(ua)
    const isIOS = /iphone|ipad|ipod/i.test(ua)

    if (isAndroid) {
      window.location.href = intentUrl
    } else if (isIOS) {
      window.location.href = whatsappScheme
    } else {
      window.location.href = waUrl
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #25d366, #128c7e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '40px 32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          width: '80px', height: '80px',
          background: '#25d366', borderRadius: '50%',
          margin: '0 auto 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111', marginBottom: '8px' }}>
          Abriendo WhatsApp...
        </h1>
        <p style={{ color: '#666', fontSize: '15px', marginBottom: '28px' }}>
          Si no se abre solo, toca el boton:
        </p>

        <button
          onClick={abrirManual}
          style={{
            display: 'block', width: '100%',
            background: '#25d366', color: 'white',
            fontWeight: '800', fontSize: '18px',
            padding: '18px', borderRadius: '14px',
            border: 'none', cursor: 'pointer',
            marginBottom: '16px',
            boxShadow: '0 8px 20px rgba(37,211,102,0.5)'
          }}
        >
          💬 Abrir WhatsApp
        </button>

        <div style={{
          background: '#f8f9fa', borderRadius: '12px',
          padding: '16px', marginTop: '8px'
        }}>
          <p style={{ color: '#555', fontSize: '13px', margin: '0 0 6px', fontWeight: '700' }}>
            ¿Desde TikTok y no abre?
          </p>
          <p style={{ color: '#777', fontSize: '12px', margin: 0, lineHeight: '1.6' }}>
            Toca los 3 puntos (...)  arriba → Abrir en navegador → luego toca el boton verde
          </p>
        </div>

        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '20px' }}>
          +{cleanPhone}
        </p>
      </div>
    </main>
  )
}