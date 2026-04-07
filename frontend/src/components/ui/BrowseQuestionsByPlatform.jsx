import { useEffect, useState } from 'react'
import { problemsApi } from '../../api/problemsApi'
import { FiSearch, FiFilter, FiX, FiExternalLink, FiRefreshCw, FiAlertCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const PLATFORMS = ['All', 'LeetCode', 'HackerRank', 'Codeforces', 'GeeksforGeeks', 'Other']
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard']

const PLATFORM_COLORS = {
  LeetCode:       'text-yellow-400',
  HackerRank:     'text-green-400',
  Codeforces:     'text-blue-400',
  GeeksforGeeks:  'text-orange-400',
  Other:          'text-gray-400',
}

const DIFFICULTY_CLASS = {
  Easy:   'badge-easy',
  Medium: 'badge-medium',
  Hard:   'badge-hard',
}

export default function BrowseQuestionsByPlatform() {
  const [selectedPlatform, setSelectedPlatform] = useState('All')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [allTags, setAllTags] = useState([])
  const [tagFilter, setTagFilter] = useState('')

  const fetchQuestions = async (platform) => {
    setLoading(true)
    setError(null)
    try {
      let questionsData = []

      if (!platform) {
        // No platform selected
        setQuestions([])
        setAllTags([])
        setLoading(false)
        return
      }

      if (platform === 'All') {
        // Fetch from all platforms
        const allQuestions = []
        const platformsToFetch = ['LeetCode', 'HackerRank', 'Codeforces', 'GeeksforGeeks', 'Other']
        
        for (const plt of platformsToFetch) {
          try {
            const params = { platform: plt }
            if (difficulty !== 'All') params.difficulty = difficulty
            if (search) params.search = search
            
            const { data } = await problemsApi.getByPlatform(params)
            allQuestions.push(...(data?.questions || []))
          } catch (err) {
            // Skip this platform if there's an error
            continue
          }
        }
        questionsData = allQuestions
      } else {
        // Fetch from specific platform
        const params = { platform }
        if (difficulty !== 'All') params.difficulty = difficulty
        if (search) params.search = search
        
        const { data } = await problemsApi.getByPlatform(params)
        questionsData = data?.questions || []
      }

      setQuestions(questionsData)
      
      // Extract unique tags
      const tags = new Set()
      questionsData.forEach(q => {
        (q.tags || []).forEach(t => tags.add(t))
      })
      setAllTags([...tags].sort())
    } catch (err) {
      setError('Failed to load questions. Please try again.')
      setQuestions([])
      setAllTags([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuestions(selectedPlatform)
    }, 300)
    return () => clearTimeout(timer)
  }, [selectedPlatform, difficulty, search])

  const filtered = selectedPlatform
    ? questions.filter(q => {
        if (tagFilter && !(q.tags || []).some(t => 
          t.toLowerCase().includes(tagFilter.toLowerCase()))) return false
        return true
      }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
        if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
        if (sortBy === 'title') return a.title.localeCompare(b.title)
        return 0
      })
    : []

  const hasFilters = search || difficulty !== 'All' || tagFilter

  const clearFilters = () => {
    setSearch('')
    setDifficulty('All')
    setTagFilter('')
    setSortBy('newest')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          {/* <h1 className="text-3xl font-bold text-white">Question Bank</h1> */}
          <p className="text-gray-400 mt-0.5 text-sm">
            {!selectedPlatform
              ? 'Select a platform to browse questions'
              : loading ? '...' : `${filtered.length} of ${questions.length} questions`}
          </p>
        </div>
      </div>

      <div className="card space-y-4">
        {/* Platform Selection */}
        <div>
          <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 block">
            Choose Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => {
                  setSelectedPlatform(p)
                  setSearch('')
                  setDifficulty('All')
                  setTagFilter('')
                  setSortBy('newest')
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all
                  ${p === selectedPlatform
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {selectedPlatform && (
          <>
            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-800">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search questions..."
                  className="input pl-10"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="input w-auto"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">A → Z</option>
              </select>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                    ${difficulty === d
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  {d}
                </button>
              ))}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
                >
                  <FiX size={13} /> Clear all
                </button>
              )}
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-gray-500 text-xs flex items-center gap-1 mr-1">
                  <FiFilter size={11} /> Tags:
                </span>
                {allTags.slice(0, 20).map(tag => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? '' : tag)}
                    className={`badge cursor-pointer transition-all
                      ${tagFilter === tag
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Error State */}
      {error && selectedPlatform && (
        <div className="flex items-center gap-3 text-red-400 card">
          <FiAlertCircle size={20} />
          <span>{error}</span>
          <button 
            onClick={() => fetchQuestions(selectedPlatform)} 
            className="ml-auto btn-secondary flex items-center gap-1 text-sm"
          >
            <FiRefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Results */}
      {selectedPlatform && !error && (
        <>
          {loading && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card h-20 animate-pulse bg-gray-800" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="card flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl mb-3 opacity-50">🔍</div>
              <p className="text-gray-300 font-medium">No questions found</p>
              <p className="text-sm text-gray-500 mt-1">
                {search || difficulty !== 'All' || tagFilter
                  ? 'Try adjusting your filters'
                  : `No problems available for ${selectedPlatform}`}
              </p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((q, idx) => (
                <div key={q._id} className="card animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="font-semibold text-gray-100 text-base truncate max-w-xs">
                          {q.url
                            ? <a
                                href={q.url}
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                              >
                                {q.title} <FiExternalLink size={13} className="opacity-60" />
                              </a>
                            : q.title}
                        </h3>
                        <span className={DIFFICULTY_CLASS[q.difficulty] || 'badge bg-gray-800 text-gray-400'}>
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        {q.platform && (
                          <span className={PLATFORM_COLORS[q.platform] || 'text-gray-400'}>
                            {q.platform}
                          </span>
                        )}
                        {q.createdAt && (
                          <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                        )}
                        {(q.tags ?? []).map(tag => (
                          <span key={tag} className="badge bg-gray-800 text-gray-400 text-[10px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {q.url && (
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-primary-400 hover:text-primary-300 border border-primary-500/30 hover:border-primary-500 transition-colors whitespace-nowrap flex-shrink-0"
                      >
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
