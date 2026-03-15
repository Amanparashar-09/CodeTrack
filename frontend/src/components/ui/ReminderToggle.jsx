// ============================================================
// COMMIT 52 — Phase 2: Core Logic — src/components/ui/ReminderToggle.jsx
// ============================================================
// COMMIT 53 — Phase 3: Polish — src/components/ui/ReminderToggle.jsx
// ============================================================

import { useState, useEffect } from 'react'
import axiosInstance from '../../api/axiosInstance'
import toast from 'react-hot-toast'
import { FiBell, FiBellOff } from 'react-icons/fi'

export default function ReminderToggle({ userId }) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch current reminder preference
  useEffect(() => {
    if (!userId) return
    axiosInstance.get('/users/reminder-pref')
      .then(r => setEnabled(r.data?.reminderEnabled ?? false))
      .catch(() => {})
  }, [userId])

  async function toggle() {
    setLoading(true)
    const next = !enabled
    // Optimistic
    setEnabled(next)
    try {
      await axiosInstance.patch('/users/reminder-pref', { reminderEnabled: next })
      toast.success(next
        ? '🔔 Daily reminders enabled!'
        : '🔕 Reminders turned off.')
    } catch {
      setEnabled(!next)
      toast.error('Failed to update reminder preference.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {enabled
          ? <FiBell size={20} className="text-primary-400" />
          : <FiBellOff size={20} className="text-gray-500" />}
        <div>
          <p className="text-sm font-medium text-gray-200">Daily Practice Reminder</p>
          <p className="text-xs text-gray-500">
            {enabled ? 'You\'ll be emailed at 8:00 AM if inactive.' : 'Reminders are off.'}
          </p>
        </div>
      </div>

      {/* Toggle switch */}
      <button
        onClick={toggle}
        disabled={loading}
        aria-label="Toggle reminder"
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 
          ${enabled ? 'bg-primary-600' : 'bg-gray-700'}
          ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                      transition-transform duration-300
                      ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}
