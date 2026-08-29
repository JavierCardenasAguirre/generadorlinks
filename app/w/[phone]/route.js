import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const { phone } = params
    const { searchParams } = new URL(request.url)
    const text = searchParams.get('text') || 'Hola, me interesa tu producto'
    
    // Limpiar el número
    const cleanPhone = phone.replace(/[\s\-+()]/g, '')
    
    // Formato compatible con TikTok/Instagram
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`
    
    return NextResponse.redirect(whatsappUrl, 307)
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url))
  }
}