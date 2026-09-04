'use client';

import { useEffect, useState } from 'react';

export default function PinkCasesPage() {
  const [linkId, setLinkId] = useState(null);
  const [isTikTok, setIsTikTok] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.length - 1];
      if (id && id !== 'pinkcases') {
        setLinkId(id);
        console.log(`🔗 Visita desde el link: ${id}`);
      }
      
      // Detectar si estamos en TikTok
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (/tiktok/i.test(userAgent)) {
        setIsTikTok(true);
        console.log('📱 Usuario en TikTok detectado');
      }
    }
  }, []);

  // 🔥 Función que intenta abrir la APP directamente
  const openApp = (appUrl, webUrl) => {
    if (isTikTok) {
      // En TikTok: intentar abrir la app primero
      const appWindow = window.open(appUrl, '_blank');
      
      // Si no se abre la app, redirigir a la web después de 1.5 segundos
      setTimeout(() => {
        if (appWindow) {
          appWindow.close();
        }
        window.location.href = webUrl;
      }, 1500);
    } else {
      // Fuera de TikTok: abrir en nueva pestaña normalmente
      window.open(webUrl, '_blank');
    }
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
          {isTikTok && (
            <p className="text-xs text-blue-500 mt-2">
              📱 Abriendo enlaces directamente en las apps...
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {/* 🔥 WhatsApp - Deep Link primero, web como fallback */}
          <button 
            onClick={() => openApp(
              'whatsapp://send?phone=573138608795',
              'https://wa.me/573138608795'
            )}
            className="w-full bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>📱</span> WhatsApp directo
          </button>
          
          {/* 🔥 Facebook - Deep Link primero, web como fallback */}
          <button 
            onClick={() => openApp(
              'fb://profile/61572968497191',
              'https://www.facebook.com/share/19WBehy8rK/'
            )}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>💙</span> Síguenos en Facebook
          </button>
          
          {/* 🔥 TikTok - Deep Link primero, web como fallback */}
          <button 
            onClick={() => openApp(
              'tiktok://user?username=pink_cases_celulares',
              'https://tiktok.com/@pink_cases_celulares'
            )}
            className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span>🌟</span> Contenido en TikTok
          </button>

          {/* 🔥 Instagram - Deep Link primero, web como fallback */}
          <button 
            onClick={() => openApp(
              'instagram://user?username=pink_cases_celulares',
              'https://instagram.com/pink_cases_celulares'
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