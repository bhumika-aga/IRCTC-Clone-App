import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Import global styles
import '@/styles/global.css'

// Enable React strict mode for development
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)