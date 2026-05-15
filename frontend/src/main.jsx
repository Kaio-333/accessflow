import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import './styles/landing.css'
import './styles/views.css'
import App from './App.jsx'

createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
