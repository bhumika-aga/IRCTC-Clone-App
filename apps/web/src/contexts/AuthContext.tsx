import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { AuthState, User, AuthResponse } from '@/types/auth'
import { authService } from '@/services/authService'
import toast from 'react-hot-toast'

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthResponse }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: {
          id: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.fullName.split(' ')[0] || '',
          lastName: action.payload.fullName.split(' ').slice(1).join(' ') || '',
          fullName: action.payload.fullName,
          aadhaarVerified: action.payload.aadhaarVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as User,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    default:
      return state
  }
}

// Context type
interface AuthContextType extends Omit<AuthState, 'refreshToken'> {
  requestOtp: (email: string, firstName: string, lastName: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  refreshTokenValue: string | null
  clearError: () => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
      if (accessToken && refreshToken) {
        try {
          // Verify token by fetching user profile
          const profile = await authService.getProfile()
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              accessToken,
              refreshToken,
              userId: profile.id,
              email: profile.email,
              fullName: profile.fullName,
              aadhaarVerified: profile.aadhaarVerified,
              tokenType: 'Bearer'
            }
          })
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Store tokens in localStorage when they change
  useEffect(() => {
    if (state.accessToken && state.refreshToken) {
      localStorage.setItem('accessToken', state.accessToken)
      localStorage.setItem('refreshToken', state.refreshToken)
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }, [state.accessToken, state.refreshToken])

  // Request OTP for login
  const requestOtp = async (email: string, firstName: string, lastName: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      await authService.requestOtp({ email, firstName, lastName })
      toast.success(`OTP sent to ${email}`)
      dispatch({ type: 'SET_LOADING', payload: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Verify OTP and login
  const verifyOtp = async (email: string, otp: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authService.verifyOtp({ email, otp })
      dispatch({ type: 'AUTH_SUCCESS', payload: response })
      toast.success('Login successful!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP'
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage })
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      if (state.isAuthenticated) {
        await authService.logout()
      }
    } catch (error) {
      console.warn('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      toast.success('Logged out successfully')
    }
  }

  // Refresh token
  const refreshTokenFn = async () => {
    if (!state.refreshToken) {
      dispatch({ type: 'LOGOUT' })
      throw new Error('No refresh token available')
    }

    try {
      const response = await authService.refreshToken({ refreshToken: state.refreshToken })
      dispatch({ type: 'AUTH_SUCCESS', payload: response })
    } catch (error) {
      dispatch({ type: 'LOGOUT' })
      throw error
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue: AuthContextType = {
    ...state,
    requestOtp,
    verifyOtp,
    logout,
    refreshToken: refreshTokenFn,
    refreshTokenValue: state.refreshToken,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}