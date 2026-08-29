import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { phone } = params
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text') || ''
    
    // Limpiar el número: quitar +, espacios, guiones
    const cleanPhone = phone.replace(/[\s\-+()]/g, '')
    
    // Construir URL de WhatsApp
    let whatsappUrl = `https://wa.me/${cleanPhone}`
    if (text) {
      whatsappUrl += `?text=${encodeURIComponent(text)}`
    }
    
    // Redirección directa
    return NextResponse.redirect(whatsappUrl, 307)
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}