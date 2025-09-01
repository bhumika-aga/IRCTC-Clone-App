import { AuthRequest, AuthResponse, OtpRequest, RefreshTokenRequest, User } from '@/types/auth'
import { apiClient } from './api'

/**
 * Authentication service
 * Handles all auth-related API calls
 */
export const authService = {
  /**
   * Request OTP for login/registration
   */
  async requestOtp(request: AuthRequest): Promise<string> {
    return apiClient.post<string>('/auth/otp-login', request)
  },

  /**
   * Verify OTP and authenticate user
   */
  async verifyOtp(request: OtpRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/verify-otp', request)
  },

  /**
   * Refresh access token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/refresh-token', request)
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    return apiClient.post<void>('/auth/logout')
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile')
  },

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    return apiClient.put<User>('/auth/profile', userData)
  }
}