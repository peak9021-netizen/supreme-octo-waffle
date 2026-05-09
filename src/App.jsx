import React, { useState, useEffect } from 'react'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import FoodJournal from './pages/FoodJournal.jsx'
import Nav from './components/Nav.jsx'

const STORAGE_KEY = 'formpeak_user'
const WEIGHT_KEY = 'formpeak_weights'
const FOOD_KEY = 'formpeak_food'

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [weights, setWeights] = useState([])
  const [foodLog, setFoodLog] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = localStorage.getItem(STORAGE_KEY)
    const w = localStorage.getItem(WEIGHT_KEY)
    const f = localStorage.getItem(FOOD_KEY)
    if (u) setUser(JSON.parse(u))
    if (w) setWeights(JSON.parse(w))
    if (f) setFoodLog(JSON.parse(f))
    setLoading(false)
  }, [])

  const saveUser = (data) => {
    const userData = {
      ...data,
      joinDate: new Date().toISOString(),
      id: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    // Add starting weight entry
    const startEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(data.currentWeight),
      note: 'Starting weight 🚀'
    }
    const initialWeights = [startEntry]
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(initialWeights))
    setWeights(initialWeights)
    setUser(userData)
  }

  const addWeight = (entry) => {
    const updated = [...weights, { ...entry, id: Date.now() }]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
    setWeights(updated)
    localStorage.setItem(WEIGHT_KEY, JSON.stringify(updated))
  }

  const addFoodEntry = (entry) => {
    const updated = [{ ...entry, id: Date.now() }, ...foodLog]
    setFoodLog(updated)
    localStorage.setItem(FOOD_KEY, JSON.stringify(updated))
  }

  const resetApp = () => {
    localStorage.clear()
    setUser(null)
    setWeights([])
    setFoodLog([])
    setPage('dashboard')
  }

  if (loading) return null

  if (!user) {
    return (
      <>
        <div className="noise" />
        <Landing onSave={saveUser} />
      </>
    )
  }

  return (
    <>
      <div className="noise" />
      <Nav page={page} setPage={setPage} user={user} onReset={resetApp} />
      <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
        {page === 'dashboard' && (
          <Dashboard user={user} weights={weights} addWeight={addWeight} />
        )}
        {page === 'food' && (
          <FoodJournal user={user} foodLog={foodLog} addFoodEntry={addFoodEntry} />
        )}
      </main>
    </>
  )
}
