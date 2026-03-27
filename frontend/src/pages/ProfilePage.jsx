
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { profileApi } from '../api/problemsApi'
import { problemsApi } from '../api/problemsApi'
import ReminderToggle from '../components/ui/ReminderToggle'
import toast from 'react-hot-toast'
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCode } from 'react-icons/fi'

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const [profile,  setProfile]  = useState(null)
  const [stats,    setStats]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form,     setForm]     = useState({ name: '', email: '' })
  const [saving,   setSaving]   = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [pRes, sRes] = await Promise.all([
          profileApi.get(),
          problemsApi.getStats(),
        ])
        setProfile(pRes.data)
        setStats(sRes.data)
        setForm({ name: pRes.data.name || '', email: pRes.data.email || '' })
      } catch {
        toast.error('Could not load profile.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSave() {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return }
    setSaving(true)
    try {
      const { data } = await profileApi.update({ name: form.name.trim() })
      setProfile(data)
      setEditMode(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const totalSolved = stats
    ? (stats.easy || 0) + (stats.medium || 0) + (stats.hard || 0)
    : 0

  const statItems = [
    { label: 'Solved',   value: totalSolved },
    { label: 'Easy',     value: stats?.easy    || 0 },
    { label: 'Medium',   value: stats?.medium  || 0 },
    { label: 'Hard',     value: stats?.hard    || 0 },
    { label: 'Streak ðŸ”¥',value: stats?.currentStreak || 0 },
    { label: 'Points',   value: stats?.totalPoints   || 0 },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Profile</h1>

      <div className="card">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_,i) => (
              <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/20 ring-1 ring-primary-500/30
                              flex items-center justify-center text-2xl font-bold text-primary-400">
                {(profile?.name || user?.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {profile?.name || user?.name}
                </h2>
                <p className="text-gray-400 text-sm">{profile?.email || user?.email}</p>
              </div>
              <button
                onClick={() => setEditMode(v => !v)}
                className="ml-auto btn-secondary flex items-center gap-2 text-sm"
              >
                {editMode ? <><FiX size={15}/> Cancel</> : <><FiEdit2 size={15}/> Edit</>}
              </button>
            </div>

            {editMode && (
              <div className="space-y-4 mb-6 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FiUser className="inline mr-1.5" size={14} />Full Name
                  </label>
                  <input
                    type="text" value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FiMail className="inline mr-1.5" size={14} />Email
                  </label>
                  <input type="email" value={form.email} disabled
                    className="input opacity-50 cursor-not-allowed" />
                  <p className="text-xs text-gray-600 mt-1">Email cannot be changed.</p>
                </div>
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary flex items-center gap-2">
                  {saving
                    ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <FiSave size={16} />}
                  {saving ? 'Savingâ€¦' : 'Save Changes'}
                </button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {statItems.map(({ label, value }) => (
                <div key={label} className="text-center bg-gray-800 rounded-xl py-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="card space-y-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiCode size={18} className="text-primary-400" /> Reminder Settings
        </h2>
        <ReminderToggle userId={user?._id || user?.id} />
      </div>

      <div className="card border-red-900/40">
        <h2 className="text-lg font-semibold text-red-400 mb-3">Danger Zone</h2>
        <button
          onClick={() => { logout(); toast.success('See you next time! ðŸ‘‹') }}
          className="bg-red-600/20 hover:bg-red-600/30 border border-red-700/40
                     text-red-400 font-medium px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
