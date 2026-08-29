'use client';
import { useState, useEffect } from 'react';

export default function EnlaceManager({ userId }) {
  const [enlaces, setEnlaces] = useState([]);
  const [nuevoEnlace, setNuevoEnlace] = useState({ titulo: '', url: '' });
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEnlaces();
  }, [userId]);

  const cargarEnlaces = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/enlaces`);
      if (response.ok) {
        const data = await response.json();
        setEnlaces(data);
      }
    } catch (error) {
      console.error('Error al cargar enlaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarEnlace = async () => {
    if (!nuevoEnlace.titulo || !nuevoEnlace.url) {
      alert('Por favor completa título y URL');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/enlaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEnlace),
      });

      if (response.ok) {
        setNuevoEnlace({ titulo: '', url: '' });
        cargarEnlaces();
      }
    } catch (error) {
      console.error('Error al agregar enlace:', error);
    }
  };

  const actualizarEnlace = async (enlaceId) => {
    if (!editando.titulo || !editando.url) {
      alert('Por favor completa título y URL');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/enlaces`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enlaceId,
          titulo: editando.titulo,
          url: editando.url,
        }),
      });

      if (response.ok) {
        setEditando(null);
        cargarEnlaces();
      }
    } catch (error) {
      console.error('Error al actualizar enlace:', error);
    }
  };

  const eliminarEnlace = async (enlaceId) => {
    if (!confirm('¿Eliminar este enlace?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}/enlaces`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enlaceId }),
      });

      if (response.ok) {
        cargarEnlaces();
      }
    } catch (error) {
      console.error('Error al eliminar enlace:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando enlaces...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Enlaces</h3>

      {/* Formulario para agregar nuevo enlace */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Título"
          value={nuevoEnlace.titulo}
          onChange={(e) =>
            setNuevoEnlace({ ...nuevoEnlace, titulo: e.target.value })
          }
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <input
          type="url"
          placeholder="https://..."
          value={nuevoEnlace.url}
          onChange={(e) =>
            setNuevoEnlace({ ...nuevoEnlace, url: e.target.value })
          }
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button
          onClick={agregarEnlace}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Agregar
        </button>
      </div>

      {/* Lista de enlaces */}
      <div className="space-y-3">
        {enlaces.map((enlace) => (
          <div
            key={enlace.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            {editando?.id === enlace.id ? (
              // Modo edición
              <div className="space-y-3">
                <input
                  type="text"
                  value={editando.titulo}
                  onChange={(e) =>
                    setEditando({ ...editando, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Título"
                />
                <input
                  type="url"
                  value={editando.url}
                  onChange={(e) =>
                    setEditando({ ...editando, url: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://..."
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditando(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => actualizarEnlace(enlace.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            ) : (
              // Modo vista
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{enlace.titulo}</h4>
                  <a
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all"
                  >
                    {enlace.url}
                  </a>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditando(enlace)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminarEnlace(enlace.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {enlaces.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No hay enlaces aún. Agrega el primero arriba.
          </p>
        )}
      </div>
    </div>
  );
}
//jhjhj