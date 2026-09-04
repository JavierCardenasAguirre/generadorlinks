import { NextResponse } from 'next/server'

const publicPaths = ['/', '/login', '/register']

export function middleware(request) {
  const token = request.cookies.get('lt_session')?.value
  const { pathname } = request.nextUrl

  const isApi = pathname.startsWith('/api')
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/register'
  
  // 🔥 NUEVO: Detectar rutas de TikTok
  const isTikTokRoute = pathname.startsWith('/r/')

  // ✅ Permitir rutas de TikTok sin ninguna verificación
  if (isTikTokRoute) {
    return NextResponse.next()
  }

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isApi) {
    return NextResponse.next()
  }

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*', 
    '/login', 
    '/register',
    '/r/:path*' // ✅ Agregar esta línea
  ]
}