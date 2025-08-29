import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useMediaQuery,
  useTheme as useMuiTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Login,
  Logout,
  Home,
  Search,
  ConfirmationNumber,
  Person
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

export function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  
  const { user, isAuthenticated, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Book Ticket', icon: <ConfirmationNumber />, path: '/search' },
    { text: 'PNR Status', icon: <Search />, path: '/pnr-status' }
  ]

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      PaperProps={{
        sx: { width: 250 }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          NextGenRail
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => {
              navigate(item.path)
              toggleMobileMenu()
            }}
            sx={{
              cursor: 'pointer',
              backgroundColor: location.pathname === item.path ? 'action.selected' : 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem onClick={toggleTheme} sx={{ cursor: 'pointer' }}>
          <ListItemIcon>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
        {isAuthenticated ? (
          <>
            <ListItem onClick={() => { navigate('/profile'); toggleMobileMenu(); }} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Person /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem onClick={() => { handleLogout(); toggleMobileMenu(); }} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <ListItem onClick={() => { handleLogin(); toggleMobileMenu(); }} sx={{ cursor: 'pointer' }}>
            <ListItemIcon><Login /></ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        )}
      </List>
    </Drawer>
  )

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="menu"
              edge="start"
              onClick={toggleMobileMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              fontWeight: 'bold',
              cursor: 'pointer',
              mr: 4
            }}
            onClick={() => navigate('/')}
          >
            🚆 NextGenRail
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile && (
              <IconButton color="inherit" onClick={toggleTheme}>
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            )}
            
            {isAuthenticated ? (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'secondary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                    <Person sx={{ mr: 1 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/my-bookings'); }}>
                    <ConfirmationNumber sx={{ mr: 1 }} /> My Bookings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                startIcon={<Login />}
                onClick={handleLogin}
                sx={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.5)'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      <MobileDrawer />
    </>
  )
}