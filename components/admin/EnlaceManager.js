'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { 
  FaPlus, FaTrash, FaEdit, FaGripVertical,
  FaWhatsapp, FaInstagram, FaTiktok, FaFacebook,
  FaGlobe, FaStore, FaCalendarCheck, FaYoutube,
  FaLinkedin, FaTwitter, FaPinterest, FaSpotify
} from 'react-icons/fa'

const iconOptions = [
  { value: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp },
  { value: 'instagram', label: 'Instagram', icon: FaInstagram },
  { value: 'tiktok', label: 'TikTok', icon: FaTiktok },
  { value: 'facebook', label: 'Facebook', icon: FaFacebook },
  { value: 'web', label: 'Sitio Web', icon: FaGlobe },
  { value: 'tienda', label: 'Tienda', icon: FaStore },
  { value: 'reservas', label: 'Reservas', icon: FaCalendarCheck },
  { value: 'youtube', label: 'YouTube', icon: FaYoutube },
  { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { value: 'twitter', label: 'Twitter', icon: FaTwitter },
  { value: 'pinterest', label: 'Pinterest', icon: FaPinterest },
  { value: 'spotify', label: 'Spotify', icon: FaSpotify },
]

export default function EnlaceManager({ clienteId }) {
  const [enlaces, setEnlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    titulo: '',
    url: '',
    tipo: 'web',
    estado: true
  })
  
  useEffect(() => {
    fetchEnlaces()
  }, [clienteId])
  
  const fetchEnlaces = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('enlaces')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('orden', { ascending: true })
    
    if (error) {
      toast.error('Error al cargar enlaces')
    } else {
      setEnlaces(data || [])
    }
    setLoading(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = {
        ...formData,
        cliente_id: clienteId,
        orden: enlaces.length
      }
      
      if (editing) {
        const { error } = await supabase
          .from('enlaces')
          .update(data)
          .eq('id', editing.id)
        
        if (error) throw error
        toast.success('Enlace actualizado')
      } else {
        const { error } = await supabase
          .from('enlaces')
          .insert([data])
        
        if (error) throw error
        toast.success('Enlace creado')
      }
      
      resetForm()
      fetchEnlaces()
    } catch (error) {
      toast.error(error.message || 'Error al guardar enlace')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este enlace?')) return
    
    const { error } = await supabase
      .from('enlaces')
      .delete()
      .eq('id', id)
    
    if (error) {
      toast.error('Error al eliminar enlace')
    } else {
      toast.success('Enlace eliminado')
      fetchEnlaces()
    }
  }
  
  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      titulo: '',
      url: '',
      tipo: 'web',
      estado: true
    })
  }
  
  const handleEdit = (enlace) => {
    setEditing(enlace)
    setFormData({
      titulo: enlace.titulo,
      url: enlace.url,
      tipo: enlace.tipo || 'web',
      estado: enlace.estado
    })
    setShowForm(true)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {enlaces.length} Enlaces
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus /> {showForm ? 'Cancelar' : 'Agregar Enlace'}
        </button>
      </div>
      
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Ej: Sígueme en Instagram"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Enlace</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Activo</label>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-2">
        {enlaces.map((enlace, index) => {
          const Icon = iconOptions.find(opt => opt.value === enlace.tipo)?.icon || FaGlobe
          return (
            <div
              key={enlace.id}
              className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="cursor-move text-gray-400">
                <FaGripVertical />
              </div>
              <div className="flex-1 flex items-center gap-3">
                <Icon className="text-xl text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{enlace.titulo}</p>
                  <p className="text-sm text-gray-500 truncate max-w-md">{enlace.url}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  enlace.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {enlace.estado ? 'Activo' : 'Inactivo'}
                </span>
                <span className="text-xs text-gray-400">#{index + 1}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(enlace)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(enlace.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          )
        })}
        
        {enlaces.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-2">🔗</p>
            <p>No hay enlaces aún</p>
            <p className="text-sm">Agrega tu primer enlace para empezar</p>
          </div>
        )}
      </div>
    </div>
  )
}