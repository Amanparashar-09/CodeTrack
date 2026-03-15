// ============================================================
// COMMIT 38 — Phase 1: Skeleton — src/components/ui/ProblemCard.jsx
// ============================================================
// COMMIT 39 — Phase 2: Core Logic — src/components/ui/ProblemCard.jsx
// ============================================================
// COMMIT 40 — Phase 3: Polish + Notes autosave — src/components/ui/ProblemCard.jsx
// ============================================================

import { useState, useRef } from 'react'
import { problemsApi } from '../../api/problemsApi'
import toast from 'react-hot-toast'
import {
  FiExternalLink, FiTrash2, FiChevronDown, FiChevronUp,
  FiEdit3, FiCheck,
} from 'react-icons/fi'

const DIFFICULTY_CLASS = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

const STATUS_OPTIONS = ['Unsolved', 'Attempted', 'Solved']

const PLATFORM_COLORS = {
  LeetCode:       'text-yellow-400',
  HackerRank:     'text-green-400',
  Codeforces:     'text-blue-400',
  GeeksforGeeks:  'text-orange-400',
}

export default function ProblemCard({ problem, onStatusChange, onDelete }) {
  const [status,       setStatus]       = useState(problem.status || 'Unsolved')
  const [statusLoading,setStatusLoading]= useState(false)
  const [notes,        setNotes]        = useState(problem.notes || '')
  const [showNotes,    setShowNotes]    = useState(false)
  const [notesSaved,   setNotesSaved]   = useState(false)
  const saveTimer = useRef(null)

  // ── Status change ────────────────────────────────────────
  async function handleStatusChange(newStatus) {
    const prev = status
    setStatus(newStatus)          // optimistic
    onStatusChange?.(problem._id, newStatus)
    setStatusLoading(true)
    try {
      await problemsApi.update(problem._id, { status: newStatus })
      if (newStatus === 'Solved' && prev !== 'Solved') {
        toast.success(`✅ "${problem.title}" marked solved! +${pointsFor(problem.difficulty)} pts`)
      }
    } catch {
      setStatus(prev)             // rollback
      onStatusChange?.(problem._id, prev)
      toast.error('Status update failed.')
    } finally {
      setStatusLoading(false)
    }
  }

  function pointsFor(d) {
    return d === 'Easy' ? 10 : d === 'Medium' ? 20 : 30
  }

  // ── Notes auto-save on blur ──────────────────────────────
  function handleNotesChange(e) {
    setNotes(e.target.value)
    setNotesSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveNotes(e.target.value), 1500)
  }

  async function saveNotes(value) {
    try {
      await problemsApi.update(problem._id, { notes: value })
      setNotesSaved(true)
    } catch {
      // silent fail — not critical
    }
  }

  // ── UI ───────────────────────────────────────────────────
  return (
    <div className="card animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">

        {/* Left: title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-100 text-base truncate max-w-xs">
              {problem.solutionLink
                ? <a href={problem.solutionLink} target="_blank" rel="noreferrer"
                     className="hover:text-primary-400 transition-colors inline-flex items-center gap-1">
                    {problem.title} <FiExternalLink size={13} className="opacity-60" />
                  </a>
                : problem.title}
            </h3>
            <span className={DIFFICULTY_CLASS[problem.difficulty] || 'badge bg-gray-800 text-gray-400'}>
              {problem.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {problem.platform && (
              <span className={PLATFORM_COLORS[problem.platform] || 'text-gray-400'}>
                {problem.platform}
              </span>
            )}
            {problem.createdAt && (
              <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
            )}
            {(problem.tags ?? []).map(tag => (
              <span key={tag} className="badge bg-gray-800 text-gray-400 text-[10px]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: status + actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Status selector */}
          <select
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={statusLoading}
            className={`input py-1.5 text-xs w-32 ${statusLoading ? 'opacity-50' : ''}
              ${status === 'Solved'    ? 'text-blue-400'
              : status === 'Attempted' ? 'text-yellow-400'
              : 'text-gray-400'}`}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Notes toggle */}
          <button
            onClick={() => setShowNotes(v => !v)}
            title="Toggle notes"
            className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {showNotes ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>

          {/* Delete */}
          <button
            onClick={onDelete}
            title="Delete problem"
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable notes */}
      {showNotes && (
        <div className="mt-3 pt-3 border-t border-gray-800 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <FiEdit3 size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500">Notes</span>
            {notesSaved && (
              <span className="text-xs text-green-400 flex items-center gap-1 ml-auto">
                <FiCheck size={12} /> Saved
              </span>
            )}
          </div>
          <textarea
            value={notes}
            onChange={handleNotesChange}
            onBlur={() => saveNotes(notes)}
            rows={3}
            placeholder="Write your approach, key insights…"
            className="input text-sm font-mono resize-y"
          />
        </div>
      )}
    </div>
  )
}
