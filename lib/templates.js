export const TEMPLATE_PRESETS = {
    pinkCases: {
        id: 'pinkCases',
        name: 'Pink Cases',
        container: 'min-h-screen bg-gradient-to-br from-pink-700 via-rose-600 to-fuchsia-700 text-white',
        card: 'bg-white/95 hover:bg-white border border-pink-300 text-gray-900 shadow-[0_10px_30px_rgba(236,72,153,0.5)] hover:shadow-[0_15px_40px_rgba(236,72,153,0.5)]',
        button: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all'
    },
    neonPulse: {
        id: 'neonPulse',
        name: 'Neon Pulse',
        container: 'min-h-screen bg-gradient-to-br from-[#0f172a] via-[#3b0764] to-[#1d4ed8] text-white',
        card: 'bg-gradient-to-r from-fuchsia-500/90 via-violet-500/90 to-blue-500/90 hover:from-fuchsia-400 hover:to-blue-400 border border-white/25 text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)]',
        button: 'bg-white/15 hover:bg-white/25 border border-white/20 text-white'
    },
    sunsetGold: {
        id: 'sunsetGold',
        name: 'Sunset Gold',
        container: 'min-h-screen bg-gradient-to-br from-[#7c2d12] via-[#c2410c] to-[#f59e0b] text-white',
        card: 'bg-gradient-to-r from-rose-600/90 via-orange-500/90 to-amber-400/90 hover:brightness-110 border border-white/30 text-white shadow-[0_12px_32px_rgba(251,146,60,0.35)]',
        button: 'bg-black/25 hover:bg-black/35 border border-white/20 text-white'
    },
    emeraldLux: {
        id: 'emeraldLux',
        name: 'Emerald Lux',
        container: 'min-h-screen bg-gradient-to-br from-[#052e16] via-[#065f46] to-[#0f766e] text-white',
        card: 'bg-gradient-to-r from-emerald-500/90 via-teal-500/90 to-cyan-500/90 hover:saturate-150 border border-white/25 text-white shadow-[0_10px_30px_rgba(16,185,129,0.35)]',
        button: 'bg-white/15 hover:bg-white/25 border border-white/20 text-white'
    },
    midnightPro: {
        id: 'midnightPro',
        name: 'Midnight Pro',
        container: 'min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white',
        card: 'bg-slate-900/80 hover:bg-slate-800/90 border border-cyan-400/35 text-cyan-100 shadow-[0_10px_28px_rgba(34,211,238,0.28)]',
        button: 'bg-slate-900/70 hover:bg-slate-800 border border-cyan-400/35 text-cyan-100'
    },
    candyPop: {
        id: 'candyPop',
        name: 'Candy Pop',
        container: 'min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 text-white',
        card: 'bg-gradient-to-r from-pink-500/95 via-purple-500/95 to-indigo-500/95 hover:scale-[1.01] border border-white/30 text-white shadow-[0_12px_28px_rgba(236,72,153,0.35)]',
        button: 'bg-white/15 hover:bg-white/25 border border-white/20 text-white'
    }
}

export const DEFAULT_TEMPLATE = 'pinkCases'