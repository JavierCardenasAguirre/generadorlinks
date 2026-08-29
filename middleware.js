import { NextResponse } from 'next/server'

const publicPaths = ['/', '/login', '/register']

export function middleware(request) {
  const token = request.cookies.get('lt_session')?.value
  const { pathname } = request.nextUrl

  const isApi = pathname.startsWith('/api')
  const isProtectedPage = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (isApi) {
    return NextResponse.next()
  }

  if (publicPaths.includes(pathname) || pathname.startsWith('/r/')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register']
}
