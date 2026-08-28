export default function EnlaceCard({ enlace, href, variantClass = '' }) {
  return (
    <a
      href={href || enlace.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 rounded-xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group ${variantClass}`}
    >
      <span className="flex-1 font-medium text-left">{enlace.titulo}</span>
      <span className="text-sm opacity-70 group-hover:opacity-100">→</span>
    </a>
  )
}
