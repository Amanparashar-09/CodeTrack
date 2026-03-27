
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { problemsApi } from '../api/problemsApi'
import toast from 'react-hot-toast'
import { FiPlusCircle, FiX } from 'react-icons/fi'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']
const STATUSES     = ['Unsolved', 'Attempted', 'Solved']
const PLATFORMS    = ['LeetCode', 'HackerRank', 'Codeforces', 'GeeksforGeeks', 'Other']

const INITIAL = {
  title: '', platform: '', difficulty: 'Easy',
  status: 'Unsolved', tags: [], notes: '', solutionLink: '',
}

export default function AddProblemPage() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState(INITIAL)
  const [tagInput,setTagInput]= useState('')
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!form.title.trim())       e.title    = 'Title is required'
    if (!form.platform)           e.platform = 'Platform is required'
    if (form.solutionLink && !/^https?:\/\/.+/.test(form.solutionLink))
      e.solutionLink = 'Enter a valid URL (starts with http/https)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await problemsApi.create({
        ...form,
        title: form.title.trim(),
        tags:  form.tags.map(t => t.trim()).filter(Boolean),
      })
      toast.success('Problem added successfully!')
      navigate('/problems')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add problem.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function addTag() {
    const t = tagInput.trim()
    if (!t || form.tags.includes(t) || form.tags.length >= 10) return
    setForm(prev => ({ ...prev, tags: [...prev.tags, t] }))
    setTagInput('')
  }

  function removeTag(tag) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag() }
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Add Problem</h1>
        <p className="text-gray-400 mt-1">Log a new coding problem to your tracker.</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          <Field label="Problem Title *" error={errors.title}>
            <input
              name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Two Sum"
              className={`input ${errors.title ? 'border-red-500' : ''}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Platform *" error={errors.platform}>
              <select name="platform" value={form.platform} onChange={handleChange}
                className={`input ${errors.platform ? 'border-red-500' : ''}`}>
                <option value="">Selectâ€¦</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Difficulty">
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Status">
            <div className="flex gap-2">
              {STATUSES.map(s => (
                <button type="button" key={s}
                  onClick={() => setForm(prev => ({ ...prev, status: s }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all
                    ${form.status === s
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label={`Tags (${form.tags.length}/10)`}>
            <div className="flex gap-2">
              <input
                value={tagInput} onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="e.g. Array, DP â€” press Enter"
                className="input"
              />
              <button type="button" onClick={addTag}
                disabled={!tagInput.trim()} className="btn-secondary px-4">
                Add
              </button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="badge bg-primary-900/60 text-primary-300
                                             flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}
                      className="hover:text-white transition-colors">
                      <FiX size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          <Field label="Solution / Problem Link" error={errors.solutionLink}>
            <input
              name="solutionLink" type="url" value={form.solutionLink} onChange={handleChange}
              placeholder="https://leetcode.com/problems/two-sum/"
              className={`input ${errors.solutionLink ? 'border-red-500' : ''}`}
            />
          </Field>

          <Field label="Notes / Approach">
            <textarea
              name="notes" value={form.notes} onChange={handleChange}
              rows={4} placeholder="Write your approach, key observationsâ€¦"
              className="input font-mono resize-y"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="btn-primary flex items-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <FiPlusCircle size={17} />}
              {loading ? 'Addingâ€¦' : 'Add Problem'}
            </button>
            <button type="button" onClick={() => navigate('/problems')}
              className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}
