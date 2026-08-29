'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export default function ClienteForm({ cliente, onSave, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: cliente?.nombre || '',
    slug: cliente?.slug || '',
    descripcion: cliente?.descripcion || '',
    color_primario: cliente?.color_primario || '#1DA1F2',
    color_secundario: cliente?.color_secundario || '#14171A',
    avatar_url: cliente?.avatar_url || '',
    estado: cliente?.estado || 'activo'
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = { ...formData, updated_at: new Date().toISOString() }
      
      if (cliente?.id) {
        const { error } = await supabase.from('clientes').update(data).eq('id', cliente.id)
        if (error) throw error
        toast.success('Cliente actualizado')
      } else {
        const { error } = await supabase.from('clientes').insert([data])
        if (error) throw error
        toast.success('Cliente creado')
      }
      
      onSave()
    } catch (error) {
      toast.error(error.message || 'Error al guardar cliente')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Ej: Mi Marca"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL Única (slug) *</label>
        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
          <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm rounded-l-lg border-r border-gray-300">/</span>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
            className="flex-1 px-4 py-2 rounded-r-lg focus:outline-none"
            required
            placeholder="mi-marca"
            pattern="[a-z0-9-]+"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Solo letras minúsculas, números y guiones</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="2"
          placeholder="Breve descripción de tu perfil"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color Principal</label>
          <input
            type="color"
            value={formData.color_primario}
            onChange={(e) => setFormData({...formData, color_primario: e.target.value})}
            className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color Secundario</label>
          <input
            type="color"
            value={formData.color_secundario}
            onChange={(e) => setFormData({...formData, color_secundario: e.target.value})}
            className="w-full h-12 rounded-lg border border-gray-300 cursor-pointer"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData({...formData, estado: e.target.value})}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}