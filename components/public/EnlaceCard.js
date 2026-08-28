export default function EnlaceCard({ enlace, href, variantClass = '' }) {
  return (
    <a
      href={href || enlace.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center gap-3 rounded-lg px-6 py-4 transition-all duration-200 hover:scale-105 hover:shadow-xl ${variantClass}`}
    >
      <span className="flex-1 text-center font-semibold text-base">{enlace.titulo}</span>
    </a>
  )
}