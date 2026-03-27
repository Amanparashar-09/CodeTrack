
import { useEffect, useState } from 'react'
import { badgesApi } from '../api/problemsApi'
import BadgeCard from '../components/ui/BadgeCard'
import { FiAward, FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

export default function BadgesPage() {
  const [badges,  setBadges]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  async function fetchBadges() {
    setLoading(true); setError(null)
    try {
      const { data } = await badgesApi.getAll()
      setBadges(data || [])
    } catch {
      setError('Could not load badges. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBadges() }, [])

  const earned  = badges.filter(b => b.earned)
  const locked  = badges.filter(b => !b.earned)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FiAward className="text-primary-400" /> Badges
        </h1>
        <p className="text-gray-400 mt-1">
          {loading ? 'â€¦' : `${earned.length} earned Â· ${locked.length} locked`}
        </p>
      </div>

      {error && (
        <div className="card flex items-center gap-3 text-red-400">
          <FiAlertCircle size={20} />
          <span>{error}</span>
          <button onClick={fetchBadges} className="ml-auto btn-secondary flex items-center gap-1 text-sm">
            <FiRefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_,i) => (
            <div key={i} className="card h-44 animate-pulse bg-gray-800" />
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
          {earned.length > 0 ? (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">
                ðŸ† Earned ({earned.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {earned.map(b => <BadgeCard key={b._id} badge={b} />)}
              </div>
            </section>
          ) : (
            <div className="card text-center py-16 text-gray-500">
              <FiAward size={48} className="mx-auto mb-4 text-gray-700" />
              <p className="text-lg font-medium text-gray-400">No badges earned yet</p>
              <p className="text-sm mt-1">Solve problems to unlock your first badge!</p>
            </div>
          )}

          {locked.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">
                ðŸ”’ Locked ({locked.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {locked.map(b => <BadgeCard key={b._id} badge={b} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
