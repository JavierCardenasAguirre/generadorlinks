'use client';

import { useEffect, useState } from 'react';

export default function PinkCasesPage() {
  const [linkId, setLinkId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'pinkcases') {
        setLinkId(id);
        console.log(`🔗 Visita desde el link: ${id}`);
      }
    }
  }, []);

  // 🔥 Función que intenta abrir deep link o fallback a web
  const openLink = (deepLink, webUrl) => {
    // Intentar abrir el deep link primero
    const win = window.open(deepLink, '_blank');
    
    // Si no se abre, redirigir a la web después de 1.5 segundos
    setTimeout(() => {
      if (win) {
        win.close();
      }
      window.location.href = webUrl;
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 md:p-8 transform transition-all hover:scale-[1.02]">
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

        <div className="mt-6 space-y-3">
          {/* 🔥 Deep Link: WhatsApp */}
          <button 
            onClick={() => openLink(
              'whatsapp://send?phone=573138608795',
              'https://wa.me/573138608795'
            )}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📱</span> WhatsApp directo
          </button>
          
          {/* 🔥 Deep Link: Facebook */}
          <button 
            onClick={() => openLink(
              'fb://profile/100065142186668',
              'https://www.facebook.com/profile.php?id=100065142186668'
            )}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>💙</span> Síguenos en Facebook
          </button>
          
          {/* 🔥 Deep Link: TikTok */}
          <button 
            onClick={() => openLink(
              'tiktok://user?username=pink_cases_celulares',
              'https://www.tiktok.com/@pink_cases_celulares'
            )}
            className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>🌟</span> Contenido en TikTok
          </button>

          {/* 🔥 URL Universal: Página Web (no necesita deep link) */}
          <a 
            href="https://www.pink-cases.com/?utm_source=tiktok&utm_medium=social&utm_campaign=pinkcases_link"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-center"
          >
            <span>🌐</span> Visita nuestra web
          </a>

          {/* 🔥 Deep Link: Instagram */}
          <button 
            onClick={() => openLink(
              'instagram://user?username=pink_cases_celulares',
              'https://www.instagram.com/pink_cases_celulares'
            )}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 hover:from-pink-600 hover:via-purple-600 hover:to-orange-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📱</span> Síguenos en Instagram
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          © 2024 PinkCases | Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}