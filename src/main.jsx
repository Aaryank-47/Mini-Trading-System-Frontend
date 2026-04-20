import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1C2030',
            color: '#FFFFFF',
            border: '1px solid #2A2F3E',
            borderRadius: '14px',
            fontSize: '13px',
            fontFamily: "'Inter', sans-serif",
            padding: '12px 16px',
          },
          success: {
            iconTheme: { primary: '#4ADE80', secondary: '#0B0E11' },
          },
          error: {
            iconTheme: { primary: '#F87171', secondary: '#0B0E11' },
          },
        }}
      />
    </BrowserRouter>
  </Provider>
)
