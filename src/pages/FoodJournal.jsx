import React, { useState, useMemo, useRef } from 'react'
import styles from './FoodJournal.module.css'

const PRESET_FOODS = [
  // Breakfast
  { id: 'p1', name: 'Oatmeal', serving: '1 cup cooked', cal: 154, protein: 5, carbs: 28, fat: 3, category: 'Breakfast', emoji: '🥣' },
  { id: 'p2', name: 'Greek Yogurt', serving: '6 oz', cal: 100, protein: 17, carbs: 6, fat: 0, category: 'Breakfast', emoji: '🍶' },
  { id: 'p3', name: 'Scrambled Eggs', serving: '2 large', cal: 182, protein: 12, carbs: 1, fat: 14, category: 'Breakfast', emoji: '🍳' },
  { id: 'p4', name: 'Banana', serving: '1 medium', cal: 105, protein: 1, carbs: 27, fat: 0, category: 'Breakfast', emoji: '🍌' },
  { id: 'p5', name: 'Whole Wheat Toast', serving: '2 slices', cal: 138, protein: 6, carbs: 24, fat: 2, category: 'Breakfast', emoji: '🍞' },
  { id: 'p6', name: 'Avocado Toast', serving: '1 slice w/ ½ avocado', cal: 220, protein: 5, carbs: 20, fat: 14, category: 'Breakfast', emoji: '🥑' },
  { id: 'p7', name: 'Protein Shake', serving: '1 scoop (whey)', cal: 120, protein: 25, carbs: 3, fat: 2, category: 'Breakfast', emoji: '🥛' },
  // Lunch
  { id: 'p8', name: 'Grilled Chicken Breast', serving: '4 oz', cal: 165, protein: 31, carbs: 0, fat: 4, category: 'Lunch', emoji: '🍗' },
  { id: 'p9', name: 'Brown Rice', serving: '1 cup cooked', cal: 216, protein: 5, carbs: 45, fat: 2, category: 'Lunch', emoji: '🍚' },
  { id: 'p10', name: 'Caesar Salad', serving: '1 large', cal: 360, protein: 10, carbs: 20, fat: 28, category: 'Lunch', emoji: '🥗' },
  { id: 'p11', name: 'Turkey Sandwich', serving: '6" sub', cal: 280, protein: 22, carbs: 34, fat: 7, category: 'Lunch', emoji: '🥪' },
  { id: 'p12', name: 'Tuna Can', serving: '5 oz', cal: 130, protein: 28, carbs: 0, fat: 1, category: 'Lunch', emoji: '🐟' },
  { id: 'p13', name: 'Quinoa Bowl', serving: '1 cup', cal: 222, protein: 8, carbs: 39, fat: 4, category: 'Lunch', emoji: '🥙' },
  // Dinner
  { id: 'p14', name: 'Salmon Fillet', serving: '6 oz', cal: 310, protein: 43, carbs: 0, fat: 15, category: 'Dinner', emoji: '🐠' },
  { id: 'p15', name: 'Steak (sirloin)', serving: '6 oz', cal: 340, protein: 46, carbs: 0, fat: 17, category: 'Dinner', emoji: '🥩' },
  { id: 'p16', name: 'Pasta (marinara)', serving: '2 cups', cal: 380, protein: 13, carbs: 76, fat: 4, category: 'Dinner', emoji: '🍝' },
  { id: 'p17', name: 'Sweet Potato', serving: '1 medium', cal: 103, protein: 2, carbs: 24, fat: 0, category: 'Dinner', emoji: '🍠' },
  { id: 'p18', name: 'Broccoli', serving: '1 cup', cal: 55, protein: 4, carbs: 11, fat: 1, category: 'Dinner', emoji: '🥦' },
  // Snacks
  { id: 'p19', name: 'Almonds', serving: '1 oz (23 nuts)', cal: 164, protein: 6, carbs: 6, fat: 14, category: 'Snacks', emoji: '🌰' },
  { id: 'p20', name: 'Apple', serving: '1 medium', cal: 95, protein: 0, carbs: 25, fat: 0, category: 'Snacks', emoji: '🍎' },
  { id: 'p21', name: 'Protein Bar', serving: '1 bar', cal: 200, protein: 20, carbs: 20, fat: 7, category: 'Snacks', emoji: '🍫' },
  { id: 'p22', name: 'Cottage Cheese', serving: '½ cup', cal: 90, protein: 12, carbs: 5, fat: 2, category: 'Snacks', emoji: '🥛' },
  { id: 'p23', name: 'Peanut Butter', serving: '2 tbsp', cal: 188, protein: 8, carbs: 6, fat: 16, category: 'Snacks', emoji: '🥜' },
  { id: 'p24', name: 'Mixed Berries', serving: '1 cup', cal: 70, protein: 1, carbs: 17, fat: 0, category: 'Snacks', emoji: '🫐' },
]

const AI_CACHE_KEY = 'formpeak_ai_foods'

const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snacks']

function MacroBar({ cal, protein, carbs, fat }) {
  const total = protein * 4 + carbs * 4 + fat * 9
  if (!total) return null
  return (
    <div className={styles.macroBar}>
      <div className={styles.macroSeg} style={{ width: `${(protein * 4 / total) * 100}%`, background: '#8b5cf6' }} title={`Protein ${protein}g`} />
      <div className={styles.macroSeg} style={{ width: `${(carbs * 4 / total) * 100}%`, background: '#06d6a0' }} title={`Carbs ${carbs}g`} />
      <div className={styles.macroSeg} style={{ width: `${(fat * 9 / total) * 100}%`, background: '#f59e0b' }} title={`Fat ${fat}g`} />
    </div>
  )
}

export default function FoodJournal({ user, foodLog, addFoodEntry }) {
  const [activeTab, setActiveTab] = useState('log') // log | search | browse
  const [meal, setMeal] = useState('Breakfast')
  const [query, setQuery] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [aiError, setAiError] = useState('')
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0])
  const [browseCategory, setBrowseCategory] = useState('Breakfast')
  const [added, setAdded] = useState(null)

  // AI food cache
  const getAiCache = () => {
    try { return JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}') }
    catch { return {} }
  }
  const setAiCache = (key, val) => {
    const cache = getAiCache()
    cache[key.toLowerCase()] = val
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache))
  }

  const searchAI = async () => {
    if (!query.trim()) return
    const key = query.trim().toLowerCase()

    // Check cache first
    const cache = getAiCache()
    if (cache[key]) {
      setAiResult(cache[key])
      return
    }

    setAiLoading(true)
    setAiError('')
    setAiResult(null)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a nutrition database. When given a food name, respond ONLY with a JSON object (no markdown, no backticks) with these exact fields:
{
  "name": "Food Name",
  "serving": "standard serving description",
  "cal": number,
  "protein": number (grams),
  "carbs": number (grams),
  "fat": number (grams),
  "category": "Breakfast|Lunch|Dinner|Snacks",
  "emoji": "1 relevant emoji",
  "description": "one sentence about this food"
}
Base values on standard nutritional data. Return ONLY valid JSON.`,
          messages: [{ role: 'user', content: `Look up nutrition for: ${query}` }]
        })
      })

      const data = await response.json()
      const text = data.content?.find(b => b.type === 'text')?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAiCache(key, parsed)
      setAiResult(parsed)
    } catch (e) {
      setAiError('Could not fetch nutrition data. Check your API key or try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const logFood = (food) => {
    addFoodEntry({
      ...food,
      meal,
      date: filterDate,
      loggedAt: new Date().toISOString()
    })
    setAdded(food.name)
    setTimeout(() => setAdded(null), 2000)
  }

  const todayLog = useMemo(() =>
    foodLog.filter(e => e.date === filterDate),
    [foodLog, filterDate]
  )

  const totals = useMemo(() => todayLog.reduce((acc, e) => ({
    cal: acc.cal + (e.cal || 0),
    protein: acc.protein + (e.protein || 0),
    carbs: acc.carbs + (e.carbs || 0),
    fat: acc.fat + (e.fat || 0),
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 }), [todayLog])

  // Estimate TDEE for calorie budget
  const tdee = useMemo(() => {
    const w = parseFloat(user.currentWeight)
    const h = parseInt(user.heightFt) * 12 + parseInt(user.heightIn || 0)
    const a = parseInt(user.age)
    const isMale = user.gender === 'Male'
    // Mifflin-St Jeor in lbs/inches
    const bmr = isMale
      ? 4.536 * w + 12.7 * h - 5 * a + 5
      : 4.536 * w + 12.7 * h - 5 * a - 161
    const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
    const raw = bmr * (mult[user.activityLevel] || 1.375)
    const deficit = parseFloat(user.weeklyGoal || 1) * 500
    return Math.round(raw - deficit)
  }, [user])

  const calLeft = tdee - totals.cal
  const calPct = Math.min(100, (totals.cal / tdee) * 100)

  const presetFiltered = PRESET_FOODS.filter(f =>
    f.category === browseCategory &&
    (query.trim() === '' || f.name.toLowerCase().includes(query.toLowerCase()))
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Food Journal</h1>
          <p className={styles.sub}>Track what you eat. Know what it costs.</p>
        </div>
        <input
          type="date"
          className={styles.datePicker}
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
      </div>

      {/* Daily summary */}
      <div className={styles.summaryGrid}>
        <div className={styles.calorieCard}>
          <div className={styles.calorieTop}>
            <div>
              <p className={styles.calLabel}>Calories today</p>
              <p className={styles.calNum}>{totals.cal.toLocaleString()}</p>
              <p className={styles.calSub}>of {tdee.toLocaleString()} target · {calLeft > 0 ? calLeft.toLocaleString() + ' left' : Math.abs(calLeft).toLocaleString() + ' over'}</p>
            </div>
            <div className={styles.calRing}>
              <svg viewBox="0 0 80 80" className={styles.ringsvg}>
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32"
                  fill="none"
                  stroke={calPct > 100 ? '#f72585' : '#8b5cf6'}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - calPct / 100)}`}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: 'stroke-dashoffset 0.6s ease' }}
                />
              </svg>
              <span className={styles.ringPct}>{Math.round(calPct)}%</span>
            </div>
          </div>
          <div className={styles.calBar}>
            <div className={styles.calBarFill} style={{ width: `${Math.min(calPct, 100)}%`, background: calPct > 100 ? 'var(--accent3)' : 'linear-gradient(90deg, var(--accent), #c084fc)' }} />
          </div>
        </div>

        <div className={styles.macrosCard}>
          <p className={styles.macrosTitle}>Macros</p>
          <div className={styles.macroItems}>
            <div className={styles.macroItem}>
              <div className={styles.macroCircle} style={{ background: 'rgba(139,92,246,0.15)', borderColor: 'var(--accent)' }}>
                <span style={{ color: 'var(--accent)' }}>{totals.protein}g</span>
              </div>
              <span className={styles.macroName}>Protein</span>
            </div>
            <div className={styles.macroItem}>
              <div className={styles.macroCircle} style={{ background: 'rgba(6,214,160,0.15)', borderColor: 'var(--accent2)' }}>
                <span style={{ color: 'var(--accent2)' }}>{totals.carbs}g</span>
              </div>
              <span className={styles.macroName}>Carbs</span>
            </div>
            <div className={styles.macroItem}>
              <div className={styles.macroCircle} style={{ background: 'rgba(245,158,11,0.15)', borderColor: '#f59e0b' }}>
                <span style={{ color: '#f59e0b' }}>{totals.fat}g</span>
              </div>
              <span className={styles.macroName}>Fat</span>
            </div>
          </div>
          <div className={styles.macroLegend}>
            <span style={{ color: 'var(--accent)' }}>■ P</span>
            <span style={{ color: 'var(--accent2)' }}>■ C</span>
            <span style={{ color: '#f59e0b' }}>■ F</span>
          </div>
          {totals.cal > 0 && <MacroBar {...totals} />}
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {[{ id: 'log', label: `📋 Today's Log (${todayLog.length})` }, { id: 'browse', label: '🍽 Browse Foods' }, { id: 'ai', label: '🤖 AI Search' }].map(t => (
          <button
            key={t.id}
            className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >{t.label}</button>
        ))}
      </div>

      {/* Meal selector */}
      {(activeTab === 'browse' || activeTab === 'ai') && (
        <div className={styles.mealBar}>
          <span className={styles.mealLabel}>Log to:</span>
          {MEALS.map(m => (
            <button
              key={m}
              className={`${styles.mealBtn} ${meal === m ? styles.mealBtnActive : ''}`}
              onClick={() => setMeal(m)}
            >{m}</button>
          ))}
        </div>
      )}

      {/* Today's log */}
      {activeTab === 'log' && (
        <div className={styles.logSection}>
          {MEALS.map(m => {
            const entries = todayLog.filter(e => e.meal === m)
            if (!entries.length) return null
            return (
              <div key={m} className={styles.mealGroup}>
                <div className={styles.mealGroupHeader}>
                  <span>{m}</span>
                  <span className={styles.mealGroupCal}>{entries.reduce((s, e) => s + (e.cal || 0), 0)} cal</span>
                </div>
                {entries.map(e => (
                  <div key={e.id} className={styles.foodRow}>
                    <span className={styles.foodRowEmoji}>{e.emoji || '🍽'}</span>
                    <div className={styles.foodRowInfo}>
                      <p className={styles.foodRowName}>{e.name}</p>
                      <p className={styles.foodRowServing}>{e.serving}</p>
                    </div>
                    <div className={styles.foodRowMacros}>
                      <span style={{ color: 'var(--accent)' }}>P {e.protein}g</span>
                      <span style={{ color: 'var(--accent2)' }}>C {e.carbs}g</span>
                      <span style={{ color: '#f59e0b' }}>F {e.fat}g</span>
                    </div>
                    <span className={styles.foodRowCal}>{e.cal} <span>cal</span></span>
                  </div>
                ))}
              </div>
            )
          })}
          {todayLog.length === 0 && (
            <div className={styles.emptyLog}>
              <span style={{ fontSize: 48 }}>🍽</span>
              <p>Nothing logged yet today.</p>
              <button className={styles.emptyBtn} onClick={() => setActiveTab('browse')}>Browse Foods</button>
            </div>
          )}
        </div>
      )}

      {/* Browse presets */}
      {activeTab === 'browse' && (
        <div className={styles.browseSection}>
          <div className={styles.searchRow}>
            <input
              className={styles.searchInput}
              placeholder="Filter foods..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className={styles.catTabs}>
            {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(c => (
              <button
                key={c}
                className={`${styles.catTab} ${browseCategory === c ? styles.catTabActive : ''}`}
                onClick={() => setBrowseCategory(c)}
              >{c}</button>
            ))}
          </div>
          <div className={styles.foodGrid}>
            {presetFiltered.map(f => (
              <FoodCard key={f.id} food={f} onLog={() => logFood(f)} isAdded={added === f.name} />
            ))}
          </div>
        </div>
      )}

      {/* AI Search */}
      {activeTab === 'ai' && (
        <div className={styles.aiSection}>
          <div className={styles.aiIntro}>
            <div className={styles.aiIcon}>🤖</div>
            <div>
              <h3>AI Nutrition Lookup</h3>
              <p className={styles.aiSub}>Search any food — even obscure ones — and AI will pull nutrition data and save it for future use.</p>
            </div>
          </div>
          <div className={styles.aiSearchRow}>
            <input
              className={styles.aiInput}
              placeholder="e.g. Big Mac, acai bowl, birria tacos..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && searchAI()}
            />
            <button
              className={styles.aiSearchBtn}
              onClick={searchAI}
              disabled={aiLoading || !query.trim()}
            >
              {aiLoading ? <span className={styles.spinner} /> : 'Search'}
            </button>
          </div>

          {aiError && <div className={styles.aiError}>{aiError}</div>}

          {aiLoading && (
            <div className={styles.aiLoading}>
              <div className={styles.aiPulse} />
              <p>Looking up <strong>{query}</strong>...</p>
            </div>
          )}

          {aiResult && !aiLoading && (
            <div className={styles.aiResultCard}>
              <div className={styles.aiResultHeader}>
                <span className={styles.aiResultEmoji}>{aiResult.emoji}</span>
                <div>
                  <h3 className={styles.aiResultName}>{aiResult.name}</h3>
                  <p className={styles.aiResultServing}>{aiResult.serving}</p>
                  {aiResult.description && <p className={styles.aiResultDesc}>{aiResult.description}</p>}
                </div>
                <div className={styles.aiResultCal}>
                  <p className={styles.aiResultCalNum}>{aiResult.cal}</p>
                  <p className={styles.aiResultCalLabel}>calories</p>
                </div>
              </div>
              <div className={styles.aiResultMacros}>
                <div className={styles.aiMacro} style={{ borderColor: 'rgba(139,92,246,0.3)' }}>
                  <span className={styles.aiMacroVal} style={{ color: 'var(--accent)' }}>{aiResult.protein}g</span>
                  <span className={styles.aiMacroLabel}>Protein</span>
                </div>
                <div className={styles.aiMacro} style={{ borderColor: 'rgba(6,214,160,0.3)' }}>
                  <span className={styles.aiMacroVal} style={{ color: 'var(--accent2)' }}>{aiResult.carbs}g</span>
                  <span className={styles.aiMacroLabel}>Carbs</span>
                </div>
                <div className={styles.aiMacro} style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
                  <span className={styles.aiMacroVal} style={{ color: '#f59e0b' }}>{aiResult.fat}g</span>
                  <span className={styles.aiMacroLabel}>Fat</span>
                </div>
              </div>
              <MacroBar {...aiResult} />
              <button
                className={`${styles.aiLogBtn} ${added === aiResult.name ? styles.aiLogBtnSuccess : ''}`}
                onClick={() => logFood(aiResult)}
              >
                {added === aiResult.name ? '✓ Added to Journal!' : `+ Add to ${meal}`}
              </button>
              <p className={styles.aiCacheTip}>💾 This food has been saved for future quick access</p>
            </div>
          )}

          {/* Cached / learned foods */}
          {!aiResult && !aiLoading && (() => {
            const cache = getAiCache()
            const keys = Object.keys(cache)
            if (!keys.length) return null
            return (
              <div className={styles.cachedSection}>
                <p className={styles.cachedTitle}>🧠 AI has learned {keys.length} food{keys.length !== 1 ? 's' : ''}</p>
                <div className={styles.foodGrid}>
                  {keys.map(k => (
                    <FoodCard key={k} food={cache[k]} onLog={() => logFood(cache[k])} isAdded={added === cache[k].name} />
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function FoodCard({ food, onLog, isAdded }) {
  return (
    <div className={styles.foodCard}>
      <div className={styles.foodCardTop}>
        <span className={styles.foodCardEmoji}>{food.emoji || '🍽'}</span>
        <div className={styles.foodCardInfo}>
          <p className={styles.foodCardName}>{food.name}</p>
          <p className={styles.foodCardServing}>{food.serving}</p>
        </div>
        <div className={styles.foodCardCal}>
          <span className={styles.foodCardCalNum}>{food.cal}</span>
          <span className={styles.foodCardCalLabel}>cal</span>
        </div>
      </div>
      <div className={styles.foodCardMacros}>
        <span style={{ color: 'var(--accent)' }}>P {food.protein}g</span>
        <span style={{ color: 'var(--accent2)' }}>C {food.carbs}g</span>
        <span style={{ color: '#f59e0b' }}>F {food.fat}g</span>
      </div>
      <MacroBar {...food} />
      <button
        className={`${styles.foodCardBtn} ${isAdded ? styles.foodCardBtnSuccess : ''}`}
        onClick={onLog}
      >
        {isAdded ? '✓ Added!' : '+ Add'}
      </button>
    </div>
  )
}
