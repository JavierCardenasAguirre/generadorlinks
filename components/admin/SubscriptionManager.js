'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import NequiPayment from './NequiPayment'

export default function SubscriptionManager({ clienteId, subscription, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  
  const updateSubscription = async (estado, dias = 30) => {
    setLoading(true)
    
    try {
      const fechaVencimiento = new Date()
      fechaVencimiento.setDate(fechaVencimiento.getDate() + dias)
      
      const { error } = await supabase
        .from('suscripciones')
        .upsert({
          cliente_id: clienteId,
          estado: estado,
          plan: 'premium',
          fecha_inicio: new Date().toISOString(),
          fecha_vencimiento: fechaVencimiento.toISOString(),
          ultimo_pago: new Date().toISOString()
        })
      
      if (error) throw error
      
      await supabase
        .from('clientes')
        .update({ estado: estado === 'activo' ? 'activo' : 'inactivo' })
        .eq('id', clienteId)
      
      toast.success(`Suscripción ${estado === 'activo' ? 'activada' : 'actualizada'}`)
      onUpdate?.()
      setShowPayment(false)
    } catch (error) {
      toast.error(error.message || 'Error al actualizar suscripción')
    } finally {
      setLoading(false)
    }
  }
  
  const getEstadoInfo = () => {
    const estados = {
      prueba: { label: 'En Prueba', color: 'bg-yellow-100 text-yellow-800', icon: '🔄' },
      activo: { label: 'Activo', color: 'bg-green-100 text-green-800', icon: '✅' },
      vencido: { label: 'Vencido', color: 'bg-red-100 text-red-800', icon: '⏰' },
      cancelado: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: '❌' }
    }
    return estados[subscription?.estado] || estados.prueba
  }
  
  const estadoInfo = getEstadoInfo()
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{estadoInfo.icon}</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${estadoInfo.color}`}>
            {estadoInfo.label}
          </span>
        </div>
        {subscription?.fecha_vencimiento && (
          <span className="text-xs text-gray-500">
            Vence: {new Date(subscription.fecha_vencimiento).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {(subscription?.estado === 'vencido' || subscription?.estado === 'prueba') && (
        <div className="flex flex-wrap gap-2">
          {!showPayment ? (
            <button
              onClick={() => setShowPayment(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
            >
              <span>💰</span> Pagar $3 USD
            </button>
          ) : (
            <div className="w-full">
              <NequiPayment 
                clienteId={clienteId}
                onSuccess={() => updateSubscription('activo')}
                onCancel={() => setShowPayment(false)}
              />
            </div>
          )}
          
          <button
            onClick={() => updateSubscription('activo')}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Activar Manualmente'}
          </button>
          
          <button
            onClick={() => updateSubscription('prueba', 30)}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm disabled:opacity-50"
          >
            Extender Prueba
          </button>
        </div>
      )}
      
      {subscription?.estado === 'activo' && (
        <button
          onClick={() => updateSubscription('vencido')}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Desactivar Suscripción
        </button>
      )}
    </div>
  )
}