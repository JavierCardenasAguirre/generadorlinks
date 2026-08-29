'use client'
import { useState } from 'react'

export default function AvatarImage({ src, nombre }) {
  const [imageError, setImageError] = useState(false)
  const inicial = nombre?.slice(0, 1)?.toUpperCase() || '?'

  if (!src || imageError) {
    return (
      <div className="w-28 h-28 rounded-full mx-auto mb-4 bg-white flex items-center justify-center text-4xl font-bold shadow-2xl border-4 border-white text-pink-600">
        {inicial}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={nombre}
      className="w-28 h-28 rounded-full mx-auto object-cover mb-4 border-4 border-white shadow-2xl"
      onError={() => setImageError(true)}
    />
  )
}