export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Plataforma tipo Linktree</h1>
        <p className="text-gray-600 mb-6">
          Crea tu página de enlaces con URL única, plantillas, estadísticas y suscripción.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/register" className="px-5 py-3 bg-blue-600 text-white rounded-lg">Crear cuenta</a>
          <a href="/login" className="px-5 py-3 bg-gray-800 text-white rounded-lg">Iniciar sesión</a>
        </div>
      </div>
    </main>
  )
}
