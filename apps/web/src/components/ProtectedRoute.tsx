import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
  requiresAuth?: boolean
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiresAuth = true, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh' 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // If authentication is required but user is not authenticated
  if (requiresAuth && !isAuthenticated) {
    // Save the attempted location for redirecting after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // If user is authenticated but shouldn't be (e.g., login page)
  if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // All good, render the children
  return <>{children}</>
}