'use client';

import { useEffect, useState } from 'react';

export default function PinkCasesPage() {
  const [linkId, setLinkId] = useState(null);

  useEffect(() => {
    // Obtener el ID del enlace de TikTok si existe
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'pinkcases') {
        setLinkId(id);
        console.log(`🔗 Visita desde el link: ${id}`);
        // Aquí puedes guardar estadísticas en Supabase si quieres
      }
    }
  }, []);

  const openExternal = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all hover:scale-[1.02]">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🌸</div>
          <h1 className="text-3xl font-bold text-pink-600">PinkCases</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Carcasas premium para iPhone | Diseños únicos y protección total | Envíos a toda Colombia 📱✨
          </p>
          {linkId && (
            <p className="text-xs text-gray-400 mt-2">
              🔗 ID: {linkId}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="mt-6 space-y-3">
          <button 
            onClick={() => openExternal('https://wa.me/1234567890')}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📱</span> WhatsApp directo
          </button>
          
          <button 
            onClick={() => openExternal('https://facebook.com/tupagina')}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>💙</span> Síguenos en Facebook
          </button>
          
          <button 
            onClick={() => openExternal('https://tiktok.com/@tucuenta')}
            className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>🌟</span> Contenido en TikTok
          </button>

          <button 
            onClick={() => openExternal('https://instagram.com/tucuenta')}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📱</span> Síguenos en Instagram
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 text-center mt-6">
          © 2024 PinkCases | Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}