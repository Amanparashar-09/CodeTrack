
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FiCode, FiHome, FiList, FiPlusCircle,
  FiUser, FiAward, FiLogOut, FiMenu, FiX,
} from 'react-icons/fi'

const navLinks = [
  { to: '/dashboard',   label: 'Dashboard',  icon: <FiHome size={18} /> },
  { to: '/problems',    label: 'Problems',   icon: <FiList size={18} /> },
  { to: '/add-problem', label: 'Add Problem',icon: <FiPlusCircle size={18} /> },
  { to: '/badges',      label: 'Badges',     icon: <FiAward size={18} /> },
  { to: '/profile',     label: 'Profile',    icon: <FiUser size={18} /> },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const [open, setOpen]  = useState(false)

  function handleLogout() {
    logout()
    toast.success('See you next time! ðŸ‘‹')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
     ${isActive
       ? 'bg-primary-600 text-white'
       : 'text-gray-400 hover:text-white hover:bg-gray-800'}`

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/dashboard" className="flex items-center gap-2 text-primary-400">
            <FiCode size={22} />
            <span className="text-xl font-bold text-gradient">CodoTrack</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.icon} {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-gray-400 text-sm">Hi, {user?.name?.split(' ')[0] || 'Coder'} ðŸ‘‹</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-400
                         text-sm px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiLogOut size={16} /> Logout
            </button>
          </div>

          <button
            onClick={() => setOpen(v => !v)}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 space-y-1 animate-fade-in">
          {navLinks.map(l => (
            <NavLink
              key={l.to} to={l.to}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
          <button
            onClick={() => { setOpen(false); handleLogout() }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg
                       text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
