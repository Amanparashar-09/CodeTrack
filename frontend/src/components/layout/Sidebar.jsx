
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiCode, FiHome, FiList, FiPlusCircle,
  FiUser, FiAward, FiLogOut,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const LINKS = [
  { to: '/dashboard',   label: 'Dashboard',   icon: <FiHome size={20} /> },
  { to: '/problems',    label: 'Problems',    icon: <FiList size={20} /> },
  { to: '/add-problem', label: 'Add Problem', icon: <FiPlusCircle size={20} /> },
  { to: '/badges',      label: 'Badges',      icon: <FiAward size={20} /> },
  { to: '/profile',     label: 'Profile',     icon: <FiUser size={20} /> },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate          = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  function handleLogout() {
    logout()
    toast.success('See you next time! ðŸ‘‹')
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
     ${collapsed ? 'justify-center px-2' : ''}
     ${isActive
       ? 'bg-primary-600 text-white shadow-md shadow-primary-900/40'
       : 'text-gray-400 hover:text-white hover:bg-gray-800'}`

  return (
    <aside
      className={`hidden md:flex flex-col justify-between
                  bg-gray-900 border-r border-gray-800 min-h-screen
                  transition-all duration-300 pt-4 pb-6
                  ${collapsed ? 'w-16' : 'w-56'}`}
    >
      <div>
        <div className={`flex items-center gap-2 px-4 mb-6 ${collapsed ? 'justify-center px-2' : ''}`}>
          <FiCode size={22} className="text-primary-400 flex-shrink-0" />
          {!collapsed && <span className="text-lg font-bold text-gradient">CodoTrack</span>}
        </div>

        <nav className="space-y-1 px-2">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass} title={collapsed ? l.label : ''}>
              <span className="flex-shrink-0">{l.icon}</span>
              {!collapsed && l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-2 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 text-xs text-gray-500 truncate">
            {user.name || user.email}
          </div>
        )}

        <button
          onClick={handleLogout}
          title="Logout"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all
                      ${collapsed ? 'justify-center px-2' : ''}`}
        >
          <FiLogOut size={20} />
          {!collapsed && 'Logout'}
        </button>

        <button
          onClick={() => setCollapsed(v => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                      text-gray-600 hover:text-gray-400 hover:bg-gray-800 transition-all
                      ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FiChevronRight size={18} /> : <><FiChevronLeft size={18} /> Collapse</>}
        </button>
      </div>
    </aside>
  )
}
