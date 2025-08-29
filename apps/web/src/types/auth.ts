/**
 * Authentication related types
 */

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  phoneNumber?: string
  aadhaarVerified: boolean
  address?: Address
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface AuthRequest {
  email: string
  firstName: string
  lastName: string
}

export interface OtpRequest {
  email: string
  otp: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: string
  email: string
  fullName: string
  aadhaarVerified: boolean
  tokenType: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}