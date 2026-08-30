'use client'

import { useEffect, useMemo, useState } from 'react'

function sanitizePhone(value) {
  return String(value || '').replace(/\D/g, '')
}

export default function WhatsAppBridgePage({ params, searchParams }) {
  const phone = sanitizePhone(params?.phone)
  const message = searchParams?.text || 'Hola, me interesa tu producto'
  const [copied, setCopied] = useState(false)
  const [copiedNum, setCopiedNum] = useState(false)
  const [isTikTok, setIsTikTok] = useState(false)

  useEffect(() => {
    const ua = (navigator.userAgent || '').toLowerCase()
    const inTikTok = /tiktok|musical_ly|bytedance/.test(ua)
    setIsTikTok(inTikTok)
  }, [])

  const links = useMemo(() => {
    const encodedText = encodeURIComponent(message)
    const waMe = `https://wa.me/${phone}?text=${encodedText}`
    return { waMe }
  }, [phone, message])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(links.waMe)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (_) { setCopied(false) }
  }

  const copyNum = async () => {
    try {
      await navigator.clipboard.writeText('+' + phone)
      setCopiedNum(true)
      setTimeout(() => setCopiedNum(false), 2500)
    } catch (_) { setCopiedNum(false) }
  }

  if (!phone) return null

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#075e54,#128c7e,#25d366)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'system-ui,-apple-system,sans-serif',
      position: 'relative'
    }}>

      {/* INDICADOR VISUAL - Solo en TikTok */}
      {isTikTok && (
        <>
          {/* Círculo rojo pulsante arriba a la derecha */}
          <div style={{
            position: 'fixed',
            top: '12px',
            right: '12px',
            width: '60px',
            height: '60px',
            background: 'rgba(255,0,0,0.25)',
            borderRadius: '50%',
            border: '4px solid #ff0000',
            animation: 'pulse 1.5s infinite',
            zIndex: 9999,
            pointerEvents: 'none'
          }} />

          {/* Flecha apuntando arriba derecha */}
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            fontSize: '48px',
            color: '#ff0000',
            animation: 'bounce 1s infinite',
            zIndex: 9998,
            pointerEvents: 'none',
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            transform: 'rotate(-45deg)'
          }}>
            ↑
          </div>

          {/* Texto grande */}
          <div style={{
            position: 'fixed',
            top: '140px',
            right: '10px',
            background: '#ff0000',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontWeight: '900',
            fontSize: '13px',
            zIndex: 9997,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
          }}>
            TOCA AQUÍ ↗️
          </div>

          <style jsx global>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 0.7; }
              50% { transform: scale(1.2); opacity: 0.3; }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0) rotate(-45deg); }
              50% { transform: translateY(-10px) rotate(-45deg); }
            }
          `}</style>
        </>
      )}

      <div style={{
        background: '#fff',
        borderRadius: '28px',
        padding: '32px 24px',
        maxWidth: '390px',
        width: '100%',
        boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        textAlign: 'center'
      }}>

        <div style={{
          width: '80px', height: '80px',
          background: '#25d366', borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37,211,102,0.45)'
        }}>
          <svg width="46" height="46" fill="white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 4px' }}>
          Contactar por WhatsApp
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '0 0 24px' }}>
          Sigue estos pasos:
        </p>

        {isTikTok && (
          <div style={{
            background: '#fff3cd',
            border: '3px solid #ff0000',
            borderRadius: '16px',
            padding: '20px 16px',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            <p style={{ fontWeight: '900', fontSize: '16px', color: '#ff0000', margin: '0 0 12px', textAlign: 'center' }}>
              ⚠️ IMPORTANTE
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <span style={{ background: '#ff0000', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>1</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: '1.5', fontWeight: '700' }}>
                Toca los <strong style={{color:'#ff0000'}}>3 puntos ↗️</strong> arriba a la derecha (mira la esquina)
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
              <span style={{ background: '#ff0000', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>2</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: '1.5', fontWeight: '700' }}>
                Selecciona <strong>Abrir en navegador</strong>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ background: '#25d366', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '14px', flexShrink: 0 }}>3</span>
              <p style={{ margin: 0, fontSize: '15px', color: '#333', lineHeight: '1.5', fontWeight: '700' }}>
                Presiona el botón verde abajo 👇
              </p>
            </div>
          </div>
        )}

        <a
          href={links.waMe}
          style={{
            display: 'block',
            background: '#25d366',
            color: '#fff',
            fontWeight: '800',
            fontSize: '18px',
            padding: '16px',
            borderRadius: '14px',
            textDecoration: 'none',
            textAlign: 'center',
            boxShadow: '0 6px 18px rgba(37,211,102,0.5)',
            marginBottom: '16px'
          }}
        >
          💬 Abrir WhatsApp
        </a>

        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 12px' }}>
          ¿No te abre? Copia el numero:
        </p>

        <div style={{
          background: '#f5f5f5',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '10px',
          fontSize: '22px',
          fontWeight: '800',
          color: '#111',
          letterSpacing: '2px'
        }}>
          +{phone}
        </div>

        <button
          type="button"
          onClick={copyNum}
          style={{
            width: '100%',
            background: copiedNum ? '#e8f5e9' : '#f0fdf4',
            border: '2px solid #25d366',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: '700',
            fontSize: '15px',
            color: '#075e54',
            cursor: 'pointer',
            marginBottom: '8px'
          }}
        >
          {copiedNum ? '✅ Numero copiado' : '📋 Copiar numero'}
        </button>

        <button
          type="button"
          onClick={copyLink}
          style={{
            width: '100%',
            background: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: '600',
            fontSize: '14px',
            color: '#555',
            cursor: 'pointer'
          }}
        >
          {copied ? '✅ Enlace copiado' : '🔗 Copiar enlace'}
        </button>

      </div>
    </main>
  )
}
