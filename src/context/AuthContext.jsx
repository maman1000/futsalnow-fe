import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/bookingApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Saat mount: baca sesi dari localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const persistSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    persistSession(res.data)
    return res.data.user
  }

  const register = async (payload) => {
    const res = await apiRegister(payload)
    persistSession(res.data)
    return res.data.user
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      // Abaikan error server — sesi lokal tetap dibersihkan
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
