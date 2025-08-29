import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Test component to access auth context
const TestComponent = () => {
  const { user, login, logout, requestOtp, verifyOtp, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? `User: ${user.email}` : 'No user'}</div>
      <button onClick={() => requestOtp({ email: 'test@example.com', firstName: 'Test', lastName: 'User' })}>
        Request OTP
      </button>
      <button onClick={() => verifyOtp({ email: 'test@example.com', otp: '123456' })}>
        Verify OTP
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const renderWithAuth = () => {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('provides initial state', () => {
    renderWithAuth();
    
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
  });

  test('loads user from localStorage on mount', () => {
    const mockUser = { 
      id: '1', 
      email: 'test@example.com', 
      firstName: 'Test', 
      lastName: 'User' 
    };
    
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'nextgenrail_user') return JSON.stringify(mockUser);
      if (key === 'nextgenrail_token') return 'mock-token';
      return null;
    });

    renderWithAuth();
    
    expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com');
  });

  test('requestOtp makes API call and handles success', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('OTP sent successfully')
    });

    renderWithAuth();
    
    await act(async () => {
      fireEvent.click(screen.getByText('Request OTP'));
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/otp-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      })
    });
  });

  test('requestOtp handles API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Failed to send OTP')
    });

    renderWithAuth();
    
    await expect(async () => {
      await act(async () => {
        fireEvent.click(screen.getByText('Request OTP'));
      });
    }).rejects.toThrow('Failed to send OTP');
  });

  test('verifyOtp makes API call and handles success', async () => {
    const mockAuthResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockAuthResponse)
    });

    renderWithAuth();
    
    await act(async () => {
      fireEvent.click(screen.getByText('Verify OTP'));
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        otp: '123456'
      })
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com');
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('nextgenrail_token', 'mock-access-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('nextgenrail_refresh_token', 'mock-refresh-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('nextgenrail_user', JSON.stringify(mockAuthResponse.user));
  });

  test('verifyOtp handles API error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: () => Promise.resolve('Invalid OTP')
    });

    renderWithAuth();
    
    await expect(async () => {
      await act(async () => {
        fireEvent.click(screen.getByText('Verify OTP'));
      });
    }).rejects.toThrow('Invalid OTP');
  });

  test('logout clears user data and localStorage', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@example.com', 
      firstName: 'Test', 
      lastName: 'User' 
    };
    
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'nextgenrail_user') return JSON.stringify(mockUser);
      if (key === 'nextgenrail_token') return 'mock-token';
      return null;
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve('Logged out successfully')
    });

    renderWithAuth();
    
    // User should be loaded initially
    expect(screen.getByTestId('user')).toHaveTextContent('User: test@example.com');

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer mock-token',
      }
    });

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(localStorage.removeItem).toHaveBeenCalledWith('nextgenrail_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('nextgenrail_refresh_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('nextgenrail_user');
  });

  test('shows loading state during async operations', async () => {
    mockFetch.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        text: () => Promise.resolve('Success')
      }), 100))
    );

    renderWithAuth();
    
    expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    
    act(() => {
      fireEvent.click(screen.getByText('Request OTP'));
    });

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });
  });

  test('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithAuth();
    
    await expect(async () => {
      await act(async () => {
        fireEvent.click(screen.getByText('Request OTP'));
      });
    }).rejects.toThrow('Network error');
  });

  test('automatically refreshes expired tokens', async () => {
    const mockUser = { 
      id: '1', 
      email: 'test@example.com', 
      firstName: 'Test', 
      lastName: 'User' 
    };
    
    (localStorage.getItem as jest.Mock).mockImplementation((key) => {
      if (key === 'nextgenrail_user') return JSON.stringify(mockUser);
      if (key === 'nextgenrail_token') return 'expired-token';
      if (key === 'nextgenrail_refresh_token') return 'refresh-token';
      return null;
    });

    // First call fails with 401, second call succeeds with new tokens
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve('Token expired')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token'
        })
      });

    renderWithAuth();
    
    // Simulate an API call that triggers token refresh
    await act(async () => {
      fireEvent.click(screen.getByText('Request OTP'));
    });

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: 'refresh-token' })
    });
  });
});