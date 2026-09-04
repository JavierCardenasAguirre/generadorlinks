'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// 🔥 Componente que maneja la redirección
function RedirectContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get('dest');
  const [buttonUrl, setButtonUrl] = useState('#');
  const [appName, setAppName] = useState('');

  useEffect(() => {
    // 🔥 Mapea el parámetro 'dest' a la URL final y nombre de la app
    const urlMap = {
      whatsapp: {
        url: 'https://wa.me/573138608795',
        name: 'WhatsApp'
      },
      instagram: {
        url: 'https://www.instagram.com/pink_cases_celulares',
        name: 'Instagram'
      },
      tiktok: {
        url: 'https://www.tiktok.com/@pink_cases_celulares',
        name: 'TikTok'
      },
      facebook: {
        url: 'https://www.facebook.com/profile.php?id=100065142186668',
        name: 'Facebook'
      },
      web: {
        url: 'https://www.pink-cases.com/?utm_source=tiktok&utm_medium=social&utm_campaign=pinkcases_link',
        name: 'nuestra web'
      },
    };
    
    if (destination && urlMap[destination]) {
      setButtonUrl(urlMap[destination].url);
      setAppName(urlMap[destination].name);
    }
  }, [destination]);

  if (!destination || !buttonUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800">Enlace no válido</h1>
          <p className="text-gray-600 mt-2">El enlace que intentas abrir no es correcto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-pink-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all hover:scale-[1.02]">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Un momento!</h1>
        <p className="text-gray-600 mb-2">
          Vas a salir de TikTok para visitar nuestro contenido en <strong>{appName}</strong>.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Haz clic en el botón para continuar.
        </p>
        <a
          href={buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
        >
          Abrir en {appName}
        </a>
        <p className="text-xs text-gray-400 mt-4">
          © 2024 PinkCases | Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

// 🔥 Componente principal con Suspense para manejar useSearchParams
export default function RedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}