import { useState, useEffect } from 'react'
import api from './services/api'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState('Checking...')

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/health')
        if (response.data && response.data.status === 'UP') {
          setHealthStatus('Connected')
        } else {
          setHealthStatus('Not Connected')
        }
      } catch (error) {
        console.error("Backend health check failed:", error)
        setHealthStatus('Not Connected')
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>PlacementHub</h1>
        <p>Student Placement Management Platform</p>
        <p>Backend Status: <span className={healthStatus === 'Connected' ? 'connected' : 'disconnected'}>{healthStatus}</span></p>
      </header>
    </div>
  )
}

export default App
