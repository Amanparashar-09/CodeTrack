
import { FiLock } from 'react-icons/fi'

/**
 * Props:
 *   badge  â€” { _id, name, description, icon, requirement, earned }
 */
export default function BadgeCard({ badge }) {
  const { name, description, icon, requirement, earned } = badge

  return (
    <div
      className={`card flex flex-col items-center text-center gap-3 transition-all duration-200
        ${earned
          ? 'ring-1 ring-primary-500/40 bg-gradient-to-b from-primary-900/20 to-transparent'
          : 'opacity-50 grayscale'}`}
    >
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl
          ${earned ? 'bg-primary-600/20 ring-1 ring-primary-500/40' : 'bg-gray-800'}`}
      >
        {earned ? (icon || '⭐') : <FiLock size={28} className="text-gray-600" />}
      </div>

      <h3 className={`font-semibold text-sm ${earned ? 'text-white' : 'text-gray-500'}`}>
        {name}
      </h3>

      {description && (
        <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
      )}

      {requirement && (
        <span className={`badge text-[10px] mt-auto
          ${earned ? 'bg-primary-900/50 text-primary-400' : 'bg-gray-800 text-gray-600'}`}>
          {requirement}
        </span>
      )}

      {earned && (
        <span className="badge bg-green-900/40 text-green-400 text-[10px]">âœ… Earned</span>
      )}
    </div>
  )
}
