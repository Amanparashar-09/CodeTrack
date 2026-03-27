
import { Link } from 'react-router-dom'
import { FiCode, FiTrendingUp, FiAward, FiBell, FiArrowRight } from 'react-icons/fi'

const FEATURES = [
  {
    icon: <FiCode size={24} />,
    title: 'Track Problems',
    desc:  'Log every problem you solve across LeetCode, Codeforces, HackerRank and more.',
    color: 'text-blue-400 bg-blue-500/10',
  },
  {
    icon: <FiTrendingUp size={24} />,
    title: 'Visualise Progress',
    desc:  'Interactive charts show your daily activity, difficulty breakdown and tag coverage.',
    color: 'text-green-400 bg-green-500/10',
  },
  {
    icon: <FiAward size={24} />,
    title: 'Earn Badges',
    desc:  'Unlock achievement badges as you hit milestones â€” stay motivated every day.',
    color: 'text-yellow-400 bg-yellow-500/10',
  },
  {
    icon: <FiBell size={24} />,
    title: 'Daily Reminders',
    desc:  'Get email nudges when you miss a day so you never break your streak.',
    color: 'text-purple-400 bg-purple-500/10',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px]
                      bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-primary-400">
          <FiCode size={24} />
          <span className="text-xl font-bold text-gradient">CodoTrack</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login"    className="btn-secondary text-sm py-2">Sign In</Link>
          <Link to="/register" className="btn-primary  text-sm py-2">Get Started</Link>
        </div>
      </nav>

      <section className="relative text-center px-6 py-24 max-w-4xl mx-auto">
        <span className="badge bg-primary-900/60 text-primary-400 mb-6 inline-block">
          Your personal coding companion
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Track your{' '}
          <span className="text-gradient">coding practice</span>
          <br />like a pro
        </h1>
        <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          Log problems, visualise streaks, earn badges and get daily reminders â€”
          all in one beautiful dashboard built for competitive programmers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link to="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center">
            Start for free <FiArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3 justify-center text-center">
            Sign In
          </Link>
        </div>
      </section>

      <section className="relative max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Everything you need to stay consistent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="card hover:ring-1 hover:ring-primary-500/30 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center pb-24 px-6">
        <div className="card max-w-xl mx-auto py-12">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to level up?</h2>
          <p className="text-gray-400 mb-6">Join developers who track their progress with CodoTrack.</p>
          <Link to="/register" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
            Create free account <FiArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="text-center text-gray-600 text-sm pb-8">
        &copy; {new Date().getFullYear()} CodoTrack â€” Built with â¤ï¸ by Member 4
      </footer>
    </div>
  )
}
