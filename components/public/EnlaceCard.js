export default function EnlaceCard({ enlace, href, variantClass = '' }) {
  return (
    <a
      href={href || enlace.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-3 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${variantClass}`}
    >
      <span className="font-semibold text-base tracking-wide">{enlace.titulo}</span>
      <span className="text-lg opacity-90 transition-transform group-hover:translate-x-1">→</span>
    </a>
  )
}