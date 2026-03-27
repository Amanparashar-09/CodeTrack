
/**
 * Props:
 *   title   â€” string          e.g. "Total Solved"
 *   value   â€” number|string   e.g. 142
 *   icon    â€” ReactNode
 *   color   â€” tailwind color class suffix (e.g. "primary", "green", "yellow", "red")
 *   change  â€” optional string e.g. "+5 this week"
 *   loading â€” bool
 */
export default function StatsCard({ title, value, icon, color = 'primary', change, loading }) {
  const colorMap = {
    primary: { ring: 'ring-primary-500/30', bg: 'bg-primary-500/10', text: 'text-primary-400' },
    green:   { ring: 'ring-green-500/30',   bg: 'bg-green-500/10',   text: 'text-green-400'   },
    yellow:  { ring: 'ring-yellow-500/30',  bg: 'bg-yellow-500/10',  text: 'text-yellow-400'  },
    red:     { ring: 'ring-red-500/30',     bg: 'bg-red-500/10',     text: 'text-red-400'     },
    cyan:    { ring: 'ring-cyan-500/30',    bg: 'bg-cyan-500/10',    text: 'text-cyan-400'    },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div className="card flex items-start gap-4 animate-fade-in">
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ring-1 ${c.ring} ${c.bg}
                       flex items-center justify-center ${c.text}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-gray-400 text-sm font-medium truncate">{title}</p>
        {loading ? (
          <div className="h-7 w-16 bg-gray-700 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-white mt-0.5">{value ?? 'â€”'}</p>
        )}
        {change && !loading && (
          <p className="text-xs text-gray-500 mt-0.5">{change}</p>
        )}
      </div>
    </div>
  )
}
