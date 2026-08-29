export default function EnlaceCard({ enlace, href, variantClass = '' }) {
  return (
    <a
      href={href || enlace.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center justify-between gap-3 rounded-xl px-8 py-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${variantClass}`}
    >
      <span className="text-lg font-bold tracking-wide">{enlace.titulo}</span>
      <span className="text-2xl font-bold transition-transform group-hover:translate-x-2">→</span>
    </a>
  )
}