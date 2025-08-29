import React from 'react'
import { Box, Typography, Container, Alert, Button } from '@mui/material'
import { FindInPage } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'

export function PnrStatus() {
  const navigate = useNavigate()

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <FindInPage sx={{ fontSize: 80, color: 'info.main', mb: 3 }} />
        
        <Typography variant="h3" gutterBottom fontWeight="bold">
          PNR Status Checker Coming Soon
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Advanced PNR tracking with AI-powered predictions
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          This page will include:
          <ul style={{ textAlign: 'left', marginTop: '8px' }}>
            <li>Real-time PNR status updates</li>
            <li>AI-powered waitlist confirmation prediction</li>
            <li>Live train tracking on map</li>
            <li>Notification alerts for status changes</li>
            <li>Journey history and timeline</li>
          </ul>
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="outlined" onClick={() => navigate('/search')}>
            Book New Ticket
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}