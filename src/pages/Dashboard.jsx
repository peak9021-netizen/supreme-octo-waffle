import React, { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend
} from 'recharts'
import styles from './Dashboard.module.css'

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipDate}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === 'weight' ? '⚖️' : '🎯'} {p.value} {unit}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Dashboard({ user, weights, addWeight }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [newNote, setNewNote] = useState('')
  const [err, setErr] = useState('')

  const goal = parseFloat(user.goalWeight)
  const start = weights.length > 0 ? weights[0].weight : parseFloat(user.currentWeight)
  const current = weights.length > 0 ? weights[weights.length - 1].weight : start
  const lost = parseFloat((start - current).toFixed(1))
  const toGo = parseFloat((current - goal).toFixed(1))
  const pct = Math.min(100, Math.max(0, Math.round(((start - current) / (start - goal)) * 100)))

  // Build chart data with goal line
  const chartData = useMemo(() => {
    return weights.map(w => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weight,
      goal: goal,
      note: w.note
    }))
  }, [weights, goal])

  const handleAdd = () => {
    if (!newWeight || parseFloat(newWeight) < 50) {
      setErr('Enter a valid weight'); return
    }
    addWeight({ date: newDate, weight: parseFloat(newWeight), note: newNote })
    setNewWeight(''); setNewNote(''); setErr('')
    setShowAdd(false)
  }

  // Streak calc
  const streak = useMemo(() => {
    if (weights.length < 2) return 0
    let s = 0
    for (let i = weights.length - 1; i >= 1; i--) {
      if (weights[i].weight <= weights[i - 1].weight) s++
      else break
    }
    return s
  }, [weights])

  const weeklyRate = useMemo(() => {
    if (weights.length < 2) return 0
    const first = weights[0]
    const last = weights[weights.length - 1]
    const days = (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24)
    if (days === 0) return 0
    const rate = ((first.weight - last.weight) / days) * 7
    return rate.toFixed(1)
  }, [weights])

  const estWeeks = useMemo(() => {
    if (toGo <= 0) return 0
    const r = parseFloat(weeklyRate)
    if (r <= 0) return '—'
    return Math.ceil(toGo / r)
  }, [toGo, weeklyRate])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Hey, {user.name} 👋</h1>
          <p className={styles.sub}>Here's your progress at a glance.</p>
        </div>
        <button className={styles.logBtn} onClick={() => setShowAdd(s => !s)}>
          {showAdd ? '✕ Cancel' : '+ Log Weight'}
        </button>
      </div>

      {/* Add weight form */}
      {showAdd && (
        <div className={styles.addCard}>
          <h3 className={styles.addTitle}>Log Today's Weight</h3>
          <div className={styles.addRow}>
            <div className={styles.addField}>
              <label>Date</label>
              <input
                type="date"
                className={styles.addInput}
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
              />
            </div>
            <div className={styles.addField}>
              <label>Weight ({user.unit})</label>
              <input
                type="number"
                className={`${styles.addInput} ${err ? styles.addInputErr : ''}`}
                placeholder={current}
                value={newWeight}
                onChange={e => { setNewWeight(e.target.value); setErr('') }}
              />
              {err && <span className={styles.addErr}>{err}</span>}
            </div>
            <div className={styles.addField} style={{ flex: 2 }}>
              <label>Note (optional)</label>
              <input
                className={styles.addInput}
                placeholder="Feeling great today!"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
            </div>
          </div>
          <button className={styles.saveBtn} onClick={handleAdd}>Save Entry ✓</button>
        </div>
      )}

      {/* Stats row */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🏁</span>
          <div>
            <p className={styles.statLabel}>Started</p>
            <p className={styles.statVal}>{start} <span>{user.unit}</span></p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>⚖️</span>
          <div>
            <p className={styles.statLabel}>Current</p>
            <p className={styles.statVal} style={{ color: 'var(--accent)' }}>{current} <span>{user.unit}</span></p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🎯</span>
          <div>
            <p className={styles.statLabel}>Goal</p>
            <p className={styles.statVal} style={{ color: 'var(--accent2)' }}>{goal} <span>{user.unit}</span></p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📉</span>
          <div>
            <p className={styles.statLabel}>Lost</p>
            <p className={styles.statVal} style={{ color: lost > 0 ? 'var(--accent2)' : 'var(--text-muted)' }}>
              {lost > 0 ? '-' : ''}{Math.abs(lost)} <span>{user.unit}</span>
            </p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>🔥</span>
          <div>
            <p className={styles.statLabel}>Streak</p>
            <p className={styles.statVal}>{streak} <span>days</span></p>
          </div>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statIcon}>📅</span>
          <div>
            <p className={styles.statLabel}>Est. goal</p>
            <p className={styles.statVal}>{estWeeks} <span>{typeof estWeeks === 'number' ? 'wks' : ''}</span></p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressCard}>
        <div className={styles.progressHeader}>
          <span>Progress to Goal</span>
          <span className={styles.progressPct}>{pct}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }}>
            {pct > 5 && <div className={styles.progressShimmer} />}
          </div>
          {pct >= 100 && <div className={styles.progressComplete}>🎉 Goal reached!</div>}
        </div>
        <div className={styles.progressSubs}>
          <span>{start} {user.unit} start</span>
          {toGo > 0 && <span style={{ color: 'var(--text-muted)' }}>{toGo} {user.unit} to go</span>}
          <span style={{ color: 'var(--accent2)' }}>{goal} {user.unit} goal</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h2 className={styles.chartTitle}>Weight Journey</h2>
          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--accent)' }} />
              <span>Weight</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: 'var(--accent2)' }} />
              <span>Goal</span>
            </div>
          </div>
        </div>

        {chartData.length < 2 ? (
          <div className={styles.emptyChart}>
            <span className={styles.emptyIcon}>📈</span>
            <p>Log at least 2 entries to see your chart</p>
            <button className={styles.emptyBtn} onClick={() => setShowAdd(true)}>+ Log Weight</button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={chartData} margin={{ top: 16, right: 16, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="goalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06d6a0" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06d6a0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fill: '#8888aa', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#8888aa', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={50}
                tickFormatter={v => `${v}`}
              />
              <Tooltip content={<CustomTooltip unit={user.unit} />} />
              <Area
                type="monotone"
                dataKey="goal"
                stroke="#06d6a0"
                strokeWidth={2}
                strokeDasharray="6 4"
                fill="url(#goalGrad)"
                dot={false}
                name="goal"
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#weightGrad)"
                dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#12121a' }}
                activeDot={{ r: 6, fill: '#c084fc' }}
                name="weight"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Log table */}
      {weights.length > 0 && (
        <div className={styles.logCard}>
          <h2 className={styles.logTitle}>History</h2>
          <div className={styles.logTable}>
            <div className={styles.logHeader}>
              <span>Date</span>
              <span>Weight</span>
              <span>Change</span>
              <span>Note</span>
            </div>
            {[...weights].reverse().map((w, i, arr) => {
              const prev = arr[i + 1]
              const change = prev ? (w.weight - prev.weight).toFixed(1) : null
              const isDown = change !== null && parseFloat(change) < 0
              const isUp = change !== null && parseFloat(change) > 0
              return (
                <div key={w.id} className={styles.logRow}>
                  <span className={styles.logDate}>
                    {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className={styles.logWeight}>{w.weight} {user.unit}</span>
                  <span style={{ color: isDown ? 'var(--accent2)' : isUp ? 'var(--accent3)' : 'var(--text-dim)' }}>
                    {change !== null ? `${parseFloat(change) > 0 ? '+' : ''}${change}` : '—'}
                  </span>
                  <span className={styles.logNote}>{w.note || '—'}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
