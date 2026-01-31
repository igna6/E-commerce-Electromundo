import { createContext, useContext, useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { login as loginApi, logout as logoutApi, refreshAccessToken, getMe } from '@/services/auth.service'

const ACCESS_TOKEN_KEY = 'electromundo-access-token'
const REFRESH_TOKEN_KEY = 'electromundo-refresh-token'

export type User = {
  id: number
  name: string
  email: string
  isAdmin: boolean
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getAccessToken = useCallback((): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }, [])

  const getRefreshToken = useCallback((): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }, [])

  const setTokens = useCallback((accessToken: string, refreshToken: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }, [])

  const clearTokens = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }, [])

  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    // Refresh token 1 minute before expiration (14 minutes for 15m tokens)
    refreshTimeoutRef.current = setTimeout(
      async () => {
        const refreshToken = getRefreshToken()
        if (refreshToken) {
          try {
            const response = await refreshAccessToken(refreshToken)
            setTokens(response.accessToken, response.refreshToken)
            scheduleTokenRefresh()
          } catch {
            setUser(null)
            clearTokens()
          }
        }
      },
      14 * 60 * 1000,
    )
  }, [getRefreshToken, setTokens, clearTokens])

  const verifyAndLoadUser = useCallback(async () => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (!accessToken && !refreshToken) {
      setIsLoading(false)
      return
    }

    try {
      if (accessToken) {
        const response = await getMe(accessToken)
        setUser(response.data)
        scheduleTokenRefresh()
      } else if (refreshToken) {
        const refreshResponse = await refreshAccessToken(refreshToken)
        setTokens(refreshResponse.accessToken, refreshResponse.refreshToken)
        const userResponse = await getMe(refreshResponse.accessToken)
        setUser(userResponse.data)
        scheduleTokenRefresh()
      }
    } catch {
      clearTokens()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [getAccessToken, getRefreshToken, setTokens, clearTokens, scheduleTokenRefresh])

  useEffect(() => {
    verifyAndLoadUser()

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [verifyAndLoadUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await loginApi(email, password)
      setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
      scheduleTokenRefresh()
    },
    [setTokens, scheduleTokenRefresh],
  )

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken()
    try {
      if (refreshToken) {
        await logoutApi(refreshToken)
      }
    } catch {
      // Ignore logout API errors
    } finally {
      clearTokens()
      setUser(null)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [getRefreshToken, clearTokens])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      getAccessToken,
    }),
    [user, isLoading, login, logout, getAccessToken],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
