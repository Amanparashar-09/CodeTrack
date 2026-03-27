
import { createContext, useContext, useEffect, useReducer } from 'react'
import axiosInstance from '../api/axiosInstance'

const initialState = {
  user:    JSON.parse(localStorage.getItem('ct_user'))   || null,
  token:   localStorage.getItem('ct_token')               || null,
  loading: false,
  error:   null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token, error: null }
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { user: null, token: null, loading: false, error: null }
    default:
      return state
  }
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  function normalizeUser(user, fallbackName = '') {
    const savedUser = JSON.parse(localStorage.getItem('ct_user') || 'null')
    return {
      id: user?.id || user?._id || savedUser?.id || savedUser?._id || null,
      name: user?.name || savedUser?.name || fallbackName || '',
      email: user?.email || savedUser?.email || '',
    }
  }

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('ct_token', state.token)
      localStorage.setItem('ct_user',  JSON.stringify(state.user))
    } else {
      localStorage.removeItem('ct_token')
      localStorage.removeItem('ct_user')
    }
  }, [state.token, state.user])


  async function login(email, password) {
    dispatch({ type: 'AUTH_START' })
    try {
      const { data } = await axiosInstance.post('/auth/login', { email, password })
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: normalizeUser(data.user), token: data.token },
      })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      dispatch({ type: 'AUTH_ERROR', payload: msg })
      return { success: false, error: msg }
    }
  }

  async function register(name, email, password) {
    dispatch({ type: 'AUTH_START' })
    try {
      const { data } = await axiosInstance.post('/auth/register', { name, email, password })
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user: normalizeUser(data.user, name), token: data.token },
      })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      dispatch({ type: 'AUTH_ERROR', payload: msg })
      return { success: false, error: msg }
    }
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
  }

  function updateUser(nextUser) {
    dispatch({ type: 'UPDATE_USER', payload: nextUser })
  }

  return (
    <AuthContext.Provider
      value={{
        user:    state.user,
        token:   state.token,
        loading: state.loading,
        error:   state.error,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
