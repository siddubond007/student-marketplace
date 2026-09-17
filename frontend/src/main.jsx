import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/home-foundation.css'
import './styles/home-dual-separator.css'
import './styles/home-dual-motion-polish.js'
import './performance/home-motion-performance.js'
import './styles/home-hero-layout-fixes.css'
import './styles/home-hero-layout-tuning.css'
import './styles/home-dual-layout-tuning.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
