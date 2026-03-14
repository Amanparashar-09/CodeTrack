// ============================================================
// COMMIT 55 — Phase 2: Core Logic — src/pages/NotFoundPage.jsx
// ============================================================

import { Link } from 'react-router-dom'
import { FiHome, FiCode } from 'react-icons/fi'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px]
                      bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative animate-slide-up">
        <div className="text-primary-400 mb-6">
          <FiCode size={48} className="mx-auto" />
        </div>
        <h1 className="text-8xl font-extrabold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page not found</h2>
        <p className="text-gray-400 max-w-sm mx-auto mb-8">
          Looks like this route doesn't exist.
          Maybe you took a wrong turn at the base case?
        </p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <FiHome size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
