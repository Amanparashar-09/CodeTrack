
import { useEffect } from 'react'
import { FiAlertTriangle, FiX } from 'react-icons/fi'

/**
 * Reusable confirm modal.
 * Props:
 *   isOpen       â€” bool
 *   onClose      â€” fn
 *   onConfirm    â€” async fn
 *   title        â€” string
 *   message      â€” string
 *   confirmLabel â€” string (default: "Confirm")
 *   confirmClass â€” Tailwind classes for confirm button
 *   loading      â€” bool
 */
export default function Modal({
  isOpen, onClose, onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmLabel = 'Confirm',
  confirmClass = 'btn-primary',
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) return
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true" role="dialog" aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative card w-full max-w-md animate-slide-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-800"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 ring-1 ring-red-500/30
                          flex items-center justify-center text-red-400 flex-shrink-0">
            <FiAlertTriangle size={20} />
          </div>
          <h2 id="modal-title" className="text-lg font-semibold text-white">{title}</h2>
        </div>

        {message && (
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{message}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} disabled={loading} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`${confirmClass} flex items-center gap-2 px-5 py-2.5 rounded-xl
                        font-medium transition-all disabled:opacity-50`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
