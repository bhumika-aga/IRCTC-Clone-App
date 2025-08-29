import { createTheme, ThemeOptions } from '@mui/material/styles'

// IRCTC-inspired color palette
const colors = {
  primary: {
    main: '#1976d2', // IRCTC blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#ff9800', // Orange accent
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#000000'
  },
  success: {
    main: '#4caf50',
    light: '#81c784',
    dark: '#388e3c'
  },
  error: {
    main: '#f44336',
    light: '#ef5350',
    dark: '#d32f2f'
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00'
  },
  info: {
    main: '#2196f3',
    light: '#64b5f6',
    dark: '#1976d2'
  }
}

// Common theme options
const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5
    },
    button: {
      fontWeight: 500,
      textTransform: 'none' as const,
      fontSize: '0.875rem'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px'
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
            boxShadow: '0 4px 8px 2px rgba(25, 118, 210, .3)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.14)'
        }
      }
    }
  }
}

// Light theme
export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    ...colors,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#212121',
      secondary: '#757575'
    },
    divider: '#e0e0e0'
  }
})

// Dark theme
export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    ...colors,
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    },
    divider: '#333333'
  },
  components: {
    ...commonThemeOptions.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.4), 0 4px 5px 0px rgba(0, 0, 0, 0.28)'
        }
      }
    }
  }
})

// Theme context type
export interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}