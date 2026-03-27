
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { problemsApi } from '../api/problemsApi'
import StatsCard          from '../components/ui/StatsCard'
import DifficultyBarChart from '../components/charts/DifficultyBarChart'
import TagDonutChart      from '../components/charts/TagDonutChart'
import ActivityLineChart  from '../components/charts/ActivityLineChart'
import RecentProblemsTable from '../components/ui/RecentProblemsTable'
import {
  FiCheckCircle, FiZap, FiTrendingUp, FiStar,
  FiPlusCircle, FiRefreshCw, FiAlertCircle,
} from 'react-icons/fi'

export default function DashboardPage() {
  const { user } = useAuth()

  const [stats,      setStats]      = useState(null)
  const [weekly,     setWeekly]     = useState([])
  const [recent,     setRecent]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, problemsRes] = await Promise.all([
        problemsApi.getStats(),
        problemsApi.getAll({ limit: 5, sort: 'createdAt', order: 'desc' }),
      ])

      setStats(statsRes.data)
      setRecent(problemsRes.data.problems || problemsRes.data || [])

      const allRes   = await problemsApi.getAll({ limit: 1000 })
      const allProbs = allRes.data.problems || allRes.data || []
      setWeekly(buildWeeklyActivity(allProbs))
    } catch (err) {
      console.error('[Dashboard] fetch error:', err)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDashboard() }, [fetchDashboard])

  function buildWeeklyActivity(problems) {
    const map = {}
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d   = new Date(now)
      d.setDate(now.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      map[key]  = 0
    }
    problems.forEach(p => {
      const key = new Date(p.createdAt).toISOString().slice(0, 10)
      if (map[key] !== undefined) map[key]++
    })
    return Object.entries(map).map(([date, count]) => ({ date, count }))
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex items-center gap-2 text-red-400">
          <FiAlertCircle size={24} />
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button onClick={fetchDashboard} className="btn-secondary flex items-center gap-2">
          <FiRefreshCw size={16} /> Retry
        </button>
      </div>
    )
  }

  const totalSolved = stats ? (stats.easy || 0) + (stats.medium || 0) + (stats.hard || 0) : 0
  const streak      = stats?.currentStreak ?? 0
  const points      = stats?.totalPoints   ?? 0
  const accuracy    = stats?.accuracy      ?? 0

  return (
    <div className="space-y-8 animate-fade-in">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0] || 'Coder'}</span>!
        </h1>
        <p className="text-gray-400 mt-1">Here's your coding progress at a glance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Solved"
          value={totalSolved}
          icon={<FiCheckCircle size={22} />}
          color="primary"
          change={`Easy: ${stats?.easy ?? 0} | Med: ${stats?.medium ?? 0} | Hard: ${stats?.hard ?? 0}`}
          loading={loading}
        />
        <StatsCard
          title="Current Streak"
          value={`${streak} days`}
          icon={<FiZap size={22} />}
          color="yellow"
          change={streak > 0 ? 'Keep it going!' : 'Start today!'}
          loading={loading}
        />
        <StatsCard
          title="Total Points"
          value={points}
          icon={<FiStar size={22} />}
          color="cyan"
          change={`Accuracy: ${accuracy}%`}
          loading={loading}
        />
        <StatsCard
          title="Problems Attempted"
          value={stats?.totalAttempted ?? 0}
          icon={<FiTrendingUp size={22} />}
          color="green"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityLineChart weeklyData={weekly} />
        </div>
        <DifficultyBarChart stats={stats?.byDifficulty ?? {}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TagDonutChart tagCounts={stats?.byTag ?? {}} />

        <div className="card flex flex-col gap-4">
          <h3 className="text-gray-300 font-semibold">Quick Actions</h3>
          <Link to="/add-problem" className="btn-primary flex items-center gap-2 justify-center">
            <FiPlusCircle size={18} /> Add New Problem
          </Link>
          <Link to="/problems" className="btn-secondary flex items-center gap-2 justify-center">
            <FiCheckCircle size={18} /> View All Problems
          </Link>
          <Link to="/badges" className="btn-secondary flex items-center gap-2 justify-center">
            <FiStar size={18} /> View Badges
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recently Added</h2>
          <Link to="/problems" className="text-primary-400 hover:text-primary-300 text-sm">
            View all â†’
          </Link>
        </div>
        <RecentProblemsTable problems={recent} loading={loading} />
      </div>
    </div>
  )
}
