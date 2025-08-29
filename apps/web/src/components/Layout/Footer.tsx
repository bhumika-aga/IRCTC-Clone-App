import React from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme
} from '@mui/material'
import {
  GitHub,
  LinkedIn,
  Twitter,
  Email
} from '@mui/icons-material'

export function Footer() {
  const theme = useTheme()
  
  const footerLinks = {
    'Quick Links': [
      { label: 'Book Tickets', href: '/search' },
      { label: 'PNR Status', href: '/pnr-status' },
      { label: 'Train Schedule', href: '/trains' },
      { label: 'Fare Enquiry', href: '/fare' }
    ],
    'Help & Support': [
      { label: 'Customer Support', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Cancellation Policy', href: '/cancellation' },
      { label: 'Terms of Service', href: '/terms' }
    ],
    'About': [
      { label: 'About NextGenRail', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Careers', href: '/careers' }
    ]
  }

  const socialLinks = [
    { icon: <GitHub />, href: 'https://github.com/nextgenrail', label: 'GitHub' },
    { icon: <LinkedIn />, href: 'https://linkedin.com/company/nextgenrail', label: 'LinkedIn' },
    { icon: <Twitter />, href: 'https://twitter.com/nextgenrail', label: 'Twitter' },
    { icon: <Email />, href: 'mailto:support@nextgenrail.com', label: 'Email' }
  ]

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
        color: 'text.primary',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
              🚆 NextGenRail
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: 300 }}>
              A modern, secure, and user-friendly railway booking platform. 
              Experience seamless train bookings with real-time updates and 
              comprehensive travel management.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  size="small"
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={12} sm={6} md={2.67} key={title}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                {title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    variant="body2"
                    sx={{
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Bottom section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} NextGenRail. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="/privacy" variant="body2" color="text.secondary" underline="hover">
              Privacy Policy
            </Link>
            <Link href="/terms" variant="body2" color="text.secondary" underline="hover">
              Terms of Service
            </Link>
            <Link href="/cookies" variant="body2" color="text.secondary" underline="hover">
              Cookie Policy
            </Link>
          </Box>
        </Box>

        {/* Development info */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Built with React 19.1, TypeScript, Material UI & Spring Boot
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}