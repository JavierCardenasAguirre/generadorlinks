'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function NequiPayment({ clienteId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  
  const phoneNumber = process.env.NEXT_PUBLIC_NEQUI_PHONE || '3123456789'
  const referencePrefix = process.env.NEXT_PUBLIC_NEQUI_REFERENCE_PREFIX || 'LINKTREE-'
  
  const handlePayment = () => {
    setLoading(true)
    
    const reference = `${referencePrefix}${clienteId}-${Date.now()}`
    
    const message = `📱 PAGO CON NEQUI\n\n💰 Valor: $3 USD (~$12,000 COP)\n📌 Referencia: ${reference}\n📞 Número: ${phoneNumber}\n\nPasos:\n1. Abre la app de Nequi\n2. Selecciona "Transferir"\n3. Ingresa el número: ${phoneNumber}\n4. Monto: $12,000 COP\n5. Referencia: ${reference}\n6. Confirma el pago\n\n✅ Después de pagar:\nEnvía el comprobante de pago a:\n📱 WhatsApp: ${phoneNumber}\n📧 Email: soporte@tudominio.com\n\nTu cuenta será activada en menos de 24 horas.`
    
    const whatsappUrl = `https://wa.me/57${phoneNumber}?text=${encodeURIComponent(
      `Hola, ya realicé el pago de mi suscripción LinkTree.\n\nReferencia: ${reference}\nNombre: [Tu nombre]\nEmail: [Tu email]\n\nAdjunto comprobante.`
    )}`
    
    alert(message)
    window.open(whatsappUrl, '_blank')
    
    toast.success('¡Pago iniciado! Revisa tu WhatsApp para enviar el comprobante.')
    setLoading(false)
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">💳 Pago con Nequi</h4>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">📱</span>
          <div>
            <p className="font-medium text-green-800">Nequi</p>
            <p className="text-sm text-green-600">{phoneNumber}</p>
          </div>
        </div>
        <p className="text-sm text-green-700"><strong>Valor:</strong> $3 USD (~$12,000 COP)</p>
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>🔹 Realiza el pago a través de Nequi</p>
        <p>🔹 Usa la referencia que se te proporcionará</p>
        <p>🔹 Envía el comprobante por WhatsApp</p>
        <p>🔹 Tu cuenta se activará en menos de 24 horas</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
        >
          {loading ? 'Procesando...' : '💰 Pagar con Nequi'}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
      
      <div className="text-center text-xs text-gray-400">
        <p>Pago manual verificado por administrador</p>
      </div>
    </div>
  )
}