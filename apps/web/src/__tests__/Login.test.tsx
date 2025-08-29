import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import theme from '../theme';

// Mock the auth context
const mockLogin = jest.fn();
const mockAuthContextValue = {
  user: null,
  login: mockLogin,
  logout: jest.fn(),
  loading: false,
  requestOtp: jest.fn(),
  verifyOtp: jest.fn()
};

jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => mockAuthContextValue
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form initially', () => {
    renderLogin();
    
    expect(screen.getByText('Welcome to NextGenRail')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    renderLogin();
    
    const sendOtpButton = screen.getByRole('button', { name: /send otp/i });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });
  });

  test('validates email format', async () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const sendOtpButton = screen.getByRole('button', { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  test('submits form with valid data', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    renderLogin();
    
    const emailInput = screen.getByLabelText(/email address/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const sendOtpButton = screen.getByRole('button', { name: /send otp/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    
    fireEvent.click(sendOtpButton);

    await waitFor(() => {
      expect(mockAuthContextValue.requestOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      });
    });
  });

  test('shows OTP verification form after successful OTP request', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    renderLogin();
    
    // Fill and submit initial form
    const emailInput = screen.getByLabelText(/email address/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(firstNameInput, { target: { value: 'Test' } });
    fireEvent.change(lastNameInput, { target: { value: 'User' } });
    
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByText('Verify OTP')).toBeInTheDocument();
      expect(screen.getByLabelText(/enter 6-digit otp/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verify otp/i })).toBeInTheDocument();
    });
  });

  test('validates OTP format', async () => {
    // Setup to show OTP form
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    renderLogin();
    
    // Navigate to OTP step
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/enter 6-digit otp/i)).toBeInTheDocument();
    });

    // Test invalid OTP
    const otpInput = screen.getByLabelText(/enter 6-digit otp/i);
    const verifyButton = screen.getByRole('button', { name: /verify otp/i });

    fireEvent.change(otpInput, { target: { value: '123' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(screen.getByText('OTP must be exactly 6 digits')).toBeInTheDocument();
    });
  });

  test('verifies OTP successfully', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    mockAuthContextValue.verifyOtp = jest.fn().mockResolvedValue(undefined);
    renderLogin();
    
    // Navigate to OTP step
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/enter 6-digit otp/i)).toBeInTheDocument();
    });

    // Verify OTP
    const otpInput = screen.getByLabelText(/enter 6-digit otp/i);
    const verifyButton = screen.getByRole('button', { name: /verify otp/i });

    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockAuthContextValue.verifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        otp: '123456'
      });
    });
  });

  test('handles OTP request error', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockRejectedValue(new Error('OTP request failed'));
    renderLogin();
    
    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to send otp/i)).toBeInTheDocument();
    });
  });

  test('handles OTP verification error', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    mockAuthContextValue.verifyOtp = jest.fn().mockRejectedValue(new Error('Invalid OTP'));
    renderLogin();
    
    // Navigate to OTP step
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/enter 6-digit otp/i)).toBeInTheDocument();
    });

    // Try to verify invalid OTP
    fireEvent.change(screen.getByLabelText(/enter 6-digit otp/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify otp/i }));

    await waitFor(() => {
      expect(screen.getByText(/otp verification failed/i)).toBeInTheDocument();
    });
  });

  test('shows loading state during form submission', async () => {
    mockAuthContextValue.loading = true;
    renderLogin();
    
    const sendOtpButton = screen.getByRole('button', { name: /send otp/i });
    expect(sendOtpButton).toBeDisabled();
  });

  test('allows going back to email form from OTP form', async () => {
    mockAuthContextValue.requestOtp = jest.fn().mockResolvedValue(undefined);
    renderLogin();
    
    // Navigate to OTP step
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'User' } });
    fireEvent.click(screen.getByRole('button', { name: /send otp/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    // Click back button
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });
});