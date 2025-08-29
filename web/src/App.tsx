import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/contexts/AuthContext'
import { CustomThemeProvider } from '@/contexts/ThemeContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Import pages
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { TrainSearch } from '@/pages/TrainSearch'
import { PnrStatus } from '@/pages/PnrStatus'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
    mutations: {
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<TrainSearch />} />
              <Route path="/pnr-status" element={<PnrStatus />} />
              
              {/* Protected routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  {/* <Profile /> */}
                  <div>Profile Page (Coming Soon)</div>
                </ProtectedRoute>
              } />
              
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  {/* <MyBookings /> */}
                  <div>My Bookings Page (Coming Soon)</div>
                </ProtectedRoute>
              } />
              
              <Route path="/book" element={
                <ProtectedRoute>
                  {/* <BookTicket /> */}
                  <div>Book Ticket Page (Coming Soon)</div>
                </ProtectedRoute>
              } />
              
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              // Define default options
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              // Default options for specific types
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </CustomThemeProvider>
    </QueryClientProvider>
  )
}

export default App