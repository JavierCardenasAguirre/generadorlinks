export const TEMPLATE_PRESETS = {
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    container: 'min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 text-white',
    card: 'bg-white/15 hover:bg-white/25 border border-white/20 text-white',
    button: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    container: 'min-h-screen bg-gradient-to-br from-orange-400 via-rose-500 to-pink-600 text-white',
    card: 'bg-black/20 hover:bg-black/30 border border-white/20 text-white',
    button: 'bg-black/30 hover:bg-black/40 border border-white/20 text-white'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    container: 'min-h-screen bg-gray-100 text-gray-900',
    card: 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-900',
    button: 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-900'
  }
}

export const DEFAULT_TEMPLATE = 'aurora'
