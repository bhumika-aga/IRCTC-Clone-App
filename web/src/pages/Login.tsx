import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Step,
  Stepper,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
  Link,
  Divider
} from '@mui/material'
import {
  Email,
  Security,
  CheckCircle
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Layout } from '@/components/Layout/Layout'

// Validation schemas
const otpRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long')
})

const otpVerifySchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits')
})

type OtpRequestForm = z.infer<typeof otpRequestSchema>
type OtpVerifyForm = z.infer<typeof otpVerifySchema>

const steps = ['Enter Details', 'Verify OTP', 'Complete']

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { requestOtp, verifyOtp, isLoading, error, clearError } = useAuth()
  
  const [activeStep, setActiveStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otpSentTime, setOtpSentTime] = useState<Date | null>(null)
  const [resendCooldown, setResendCooldown] = useState(0)

  // Get redirect path from location state
  const redirectPath = (location.state as any)?.from?.pathname || '/'

  // Form for OTP request
  const otpRequestForm = useForm<OtpRequestForm>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: ''
    }
  })

  // Form for OTP verification
  const otpVerifyForm = useForm<OtpVerifyForm>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      otp: ''
    }
  })

  // Handle OTP request
  const handleOtpRequest = async (data: OtpRequestForm) => {
    try {
      clearError()
      await requestOtp(data.email, data.firstName, data.lastName)
      setEmail(data.email)
      setActiveStep(1)
      setOtpSentTime(new Date())
      startResendCooldown()
    } catch (error) {
      // Error is handled by context and shown via toast
    }
  }

  // Handle OTP verification
  const handleOtpVerify = async (data: OtpVerifyForm) => {
    try {
      clearError()
      await verifyOtp(email, data.otp)
      setActiveStep(2)
      
      // Redirect after success
      setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 1500)
    } catch (error) {
      // Error is handled by context and shown via toast
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    try {
      const formData = otpRequestForm.getValues()
      await requestOtp(formData.email, formData.firstName, formData.lastName)
      setOtpSentTime(new Date())
      startResendCooldown()
    } catch (error) {
      // Error is handled by context
    }
  }

  // Start resend cooldown timer
  const startResendCooldown = () => {
    setResendCooldown(60) // 60 seconds cooldown
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <Layout maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper 
          elevation={4}
          sx={{ 
            p: 4,
            borderRadius: 3,
            background: theme => theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(25,118,210,0.1) 0%, rgba(66,165,245,0.05) 100%)'
              : 'linear-gradient(135deg, rgba(25,118,210,0.05) 0%, rgba(66,165,245,0.02) 100%)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your NextGenRail account
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>
                  {index === 0 && <Email sx={{ mr: 1 }} />}
                  {index === 1 && <Security sx={{ mr: 1 }} />}
                  {index === 2 && <CheckCircle sx={{ mr: 1 }} />}
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Step 1: Email and Name */}
          {activeStep === 0 && (
            <form onSubmit={otpRequestForm.handleSubmit(handleOtpRequest)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    {...otpRequestForm.register('email')}
                    error={!!otpRequestForm.formState.errors.email}
                    helperText={otpRequestForm.formState.errors.email?.message}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    {...otpRequestForm.register('firstName')}
                    error={!!otpRequestForm.formState.errors.firstName}
                    helperText={otpRequestForm.formState.errors.firstName?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    {...otpRequestForm.register('lastName')}
                    error={!!otpRequestForm.formState.errors.lastName}
                    helperText={otpRequestForm.formState.errors.lastName?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{ py: 1.5 }}
                  >
                    {isLoading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {activeStep === 1 && (
            <Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                We've sent a 6-digit OTP to <strong>{email}</strong>. 
                Please check your inbox and enter the code below.
              </Alert>

              <form onSubmit={otpVerifyForm.handleSubmit(handleOtpVerify)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Enter OTP"
                      placeholder="000000"
                      inputProps={{ 
                        maxLength: 6,
                        style: { 
                          textAlign: 'center', 
                          fontSize: '1.5rem',
                          letterSpacing: '0.5rem'
                        }
                      }}
                      {...otpVerifyForm.register('otp')}
                      error={!!otpVerifyForm.formState.errors.otp}
                      helperText={otpVerifyForm.formState.errors.otp?.message || 'Enter the 6-digit code sent to your email'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{ py: 1.5 }}
                    >
                      {isLoading ? (
                        <>
                          <CircularProgress size={20} sx={{ mr: 1 }} />
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Didn't receive the OTP?
                </Typography>
                <Button
                  variant="text"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0}
                  size="small"
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: Success */}
          {activeStep === 2 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Login Successful!
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Redirecting you to your dashboard...
              </Typography>
              <CircularProgress />
            </Box>
          )}

          {/* Back to previous step */}
          {activeStep === 1 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => setActiveStep(0)}
                sx={{ cursor: 'pointer' }}
              >
                ← Change email address
              </Link>
            </Box>
          )}
        </Paper>

        {/* Additional info */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            By continuing, you agree to our{' '}
            <Link href="/terms" color="primary">Terms of Service</Link> and{' '}
            <Link href="/privacy" color="primary">Privacy Policy</Link>
          </Typography>
        </Box>
      </Box>
    </Layout>
  )
}