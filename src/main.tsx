
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// The MSW initialization is now handled in App.tsx, so we don't need to call it here
// This prevents duplicate initialization which could cause issues

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
