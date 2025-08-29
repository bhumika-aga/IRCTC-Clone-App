import React from 'react'
import { Box, Typography, Container, Alert, Button } from '@mui/material'
import { Construction } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout/Layout'

export function TrainSearch() {
  const navigate = useNavigate()

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Construction sx={{ fontSize: 80, color: 'warning.main', mb: 3 }} />
        
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Train Search Coming Soon
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          We're working hard to bring you the best train search experience
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4 }}>
          This page will include:
          <ul style={{ textAlign: 'left', marginTop: '8px' }}>
            <li>Smart station search with autocomplete</li>
            <li>Real-time train availability</li>
            <li>Interactive seat map selection</li>
            <li>Multi-quota booking (Tatkal, Ladies, Senior Citizen)</li>
            <li>Fare comparison across classes</li>
          </ul>
        </Alert>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="outlined" onClick={() => navigate('/pnr-status')}>
            Check PNR Status
          </Button>
        </Box>
      </Container>
    </Layout>
  )
}