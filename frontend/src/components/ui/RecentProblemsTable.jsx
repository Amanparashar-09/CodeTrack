// ============================================================
// COMMIT 34 — Phase 2: Core Logic — src/components/ui/RecentProblemsTable.jsx
// ============================================================

import { Link } from 'react-router-dom'

const DIFFICULTY_CLASS = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

const STATUS_CLASS = {
  Solved:     'badge bg-blue-900/60 text-blue-400',
  Attempted:  'badge bg-yellow-900/60 text-yellow-400',
  Unsolved:   'badge bg-gray-800 text-gray-400',
}

export default function RecentProblemsTable({ problems = [], loading }) {
  if (loading) {
    return (
      <div className="card space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="card text-center py-12 text-gray-500">
        <p className="text-lg">No problems yet.</p>
        <Link to="/add-problem" className="text-primary-400 hover:text-primary-300 text-sm mt-1 block">
          Add your first problem →
        </Link>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Platform</th>
              <th className="px-6 py-3 text-left">Difficulty</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {problems.map((p) => (
              <tr key={p._id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-6 py-3.5 font-medium text-gray-200 max-w-[200px] truncate">
                  {p.solutionLink
                    ? <a href={p.solutionLink} target="_blank" rel="noreferrer"
                         className="hover:text-primary-400 transition-colors">{p.title}</a>
                    : p.title}
                </td>
                <td className="px-6 py-3.5 text-gray-400">{p.platform || '—'}</td>
                <td className="px-6 py-3.5">
                  <span className={DIFFICULTY_CLASS[p.difficulty] || 'badge bg-gray-800 text-gray-400'}>
                    {p.difficulty}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className={STATUS_CLASS[p.status] || STATUS_CLASS.Unsolved}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex gap-1 flex-wrap">
                    {(p.tags || []).slice(0, 3).map(tag => (
                      <span key={tag} className="badge bg-gray-800 text-gray-400 text-[10px]">{tag}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
