export const TEMPLATE_PRESETS = {
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    container: 'min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white',
    card: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900 shadow-lg',
    button: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    container: 'min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white',
    card: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900 shadow-lg',
    button: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    container: 'min-h-screen bg-gray-50 text-gray-900',
    card: 'bg-white hover:bg-gray-50 border-2 border-gray-900 text-gray-900 shadow-md hover:shadow-xl',
    button: 'bg-white hover:bg-gray-50 border-2 border-gray-900 text-gray-900'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    container: 'min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 text-white',
    card: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900 shadow-lg',
    button: 'bg-white/95 hover:bg-white border border-gray-200 text-gray-900'
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    container: 'min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white',
    card: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-xl',
    button: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
  }
}

export const DEFAULT_TEMPLATE = 'aurora'