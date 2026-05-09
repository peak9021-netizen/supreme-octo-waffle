import React, { useState } from 'react'
import styles from './Landing.module.css'

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
  { value: 'light', label: 'Light', desc: '1–3 days/week' },
  { value: 'moderate', label: 'Moderate', desc: '3–5 days/week' },
  { value: 'active', label: 'Active', desc: '6–7 days/week' },
  { value: 'very_active', label: 'Athletic', desc: 'Twice a day' },
]

export default function Landing({ onSave }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    heightFt: '',
    heightIn: '',
    currentWeight: '',
    goalWeight: '',
    activityLevel: '',
    weeklyGoal: '1',
    unit: 'lbs'
  })
  const [errors, setErrors] = useState({})

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const validateStep1 = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.age || form.age < 13 || form.age > 100) e.age = 'Enter valid age (13–100)'
    if (!form.gender) e.gender = 'Select gender'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.heightFt || form.heightFt < 3 || form.heightFt > 8) e.heightFt = 'Enter feet (3–8)'
    if (form.heightIn === '' || form.heightIn < 0 || form.heightIn > 11) e.heightIn = 'Enter inches (0–11)'
    if (!form.currentWeight || form.currentWeight < 50) e.currentWeight = 'Enter valid weight'
    if (!form.goalWeight || form.goalWeight < 50) e.goalWeight = 'Enter valid goal'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e = {}
    if (!form.activityLevel) e.activityLevel = 'Select activity level'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step === 3 && !validateStep3()) return
    if (step === 3) { onSave(form); return }
    setStep(s => s + 1)
  }

  const bmi = () => {
    if (!form.heightFt || !form.currentWeight) return null
    const inches = parseInt(form.heightFt) * 12 + parseInt(form.heightIn || 0)
    const bmiVal = (703 * parseFloat(form.currentWeight)) / (inches * inches)
    return bmiVal.toFixed(1)
  }

  const bmiCategory = (b) => {
    if (b < 18.5) return { label: 'Underweight', color: '#60a5fa' }
    if (b < 25) return { label: 'Healthy', color: '#06d6a0' }
    if (b < 30) return { label: 'Overweight', color: '#fbbf24' }
    return { label: 'Obese', color: '#f72585' }
  }

  const currentBmi = bmi()
  const bmiInfo = currentBmi ? bmiCategory(parseFloat(currentBmi)) : null

  return (
    <div className={styles.container}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      <div className={styles.inner}>
        {/* Left branding */}
        <div className={styles.brand}>
          <div className={styles.logo}>FP</div>
          <h1 className={styles.appName}>FormPeak</h1>
          <p className={styles.tagline}>Track. Eat. Dominate.</p>

          <div className={styles.statList}>
            <div className={styles.stat}>
              <span className={styles.statNum}>94%</span>
              <span className={styles.statLabel}>of users hit their first goal</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>3.2×</span>
              <span className={styles.statLabel}>more effective than guessing</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>∞</span>
              <span className={styles.statLabel}>food entries powered by AI</span>
            </div>
          </div>

          <div className={styles.stepIndicatorWrap}>
            {[1,2,3].map(s => (
              <div key={s} className={`${styles.stepDot} ${step >= s ? styles.stepDotActive : ''}`}>
                <span>{s}</span>
              </div>
            ))}
            <div className={styles.stepLine}>
              <div className={styles.stepLineFill} style={{ width: `${((step-1)/2)*100}%` }} />
            </div>
          </div>
          <p className={styles.stepLabel}>Step {step} of 3</p>
        </div>

        {/* Right form */}
        <div className={styles.card}>
          {step === 1 && (
            <div className={styles.formStep}>
              <h2 className={styles.formTitle}>Who are you?</h2>
              <p className={styles.formSub}>Let's get the basics down first.</p>

              <div className={styles.field}>
                <label>Name</label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputErr : ''}`}
                  placeholder="Your first name"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
                {errors.name && <span className={styles.err}>{errors.name}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Age</label>
                  <input
                    className={`${styles.input} ${errors.age ? styles.inputErr : ''}`}
                    type="number" placeholder="25"
                    value={form.age}
                    onChange={e => set('age', e.target.value)}
                  />
                  {errors.age && <span className={styles.err}>{errors.age}</span>}
                </div>
                <div className={styles.field}>
                  <label>Units</label>
                  <div className={styles.toggle}>
                    {['lbs','kg'].map(u => (
                      <button
                        key={u}
                        className={`${styles.toggleBtn} ${form.unit === u ? styles.toggleBtnActive : ''}`}
                        onClick={() => set('unit', u)}
                        type="button"
                      >{u}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.field}>
                <label>Gender</label>
                <div className={styles.genderGrid}>
                  {['Male','Female','Non-binary','Prefer not to say'].map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.genderBtn} ${form.gender === g ? styles.genderBtnActive : ''}`}
                      onClick={() => set('gender', g)}
                    >{g}</button>
                  ))}
                </div>
                {errors.gender && <span className={styles.err}>{errors.gender}</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.formStep}>
              <h2 className={styles.formTitle}>Your body.</h2>
              <p className={styles.formSub}>Real numbers only — no judgment here.</p>

              <div className={styles.field}>
                <label>Height</label>
                <div className={styles.row}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${errors.heightFt ? styles.inputErr : ''}`}
                        type="number" placeholder="5"
                        value={form.heightFt}
                        onChange={e => set('heightFt', e.target.value)}
                      />
                      <span className={styles.inputUnit}>ft</span>
                    </div>
                    {errors.heightFt && <span className={styles.err}>{errors.heightFt}</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className={styles.inputWrap}>
                      <input
                        className={`${styles.input} ${errors.heightIn ? styles.inputErr : ''}`}
                        type="number" placeholder="10"
                        value={form.heightIn}
                        onChange={e => set('heightIn', e.target.value)}
                      />
                      <span className={styles.inputUnit}>in</span>
                    </div>
                    {errors.heightIn && <span className={styles.err}>{errors.heightIn}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Current Weight</label>
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${errors.currentWeight ? styles.inputErr : ''}`}
                      type="number" placeholder="185"
                      value={form.currentWeight}
                      onChange={e => set('currentWeight', e.target.value)}
                    />
                    <span className={styles.inputUnit}>{form.unit}</span>
                  </div>
                  {errors.currentWeight && <span className={styles.err}>{errors.currentWeight}</span>}
                </div>
                <div className={styles.field}>
                  <label>Goal Weight</label>
                  <div className={styles.inputWrap}>
                    <input
                      className={`${styles.input} ${errors.goalWeight ? styles.inputErr : ''}`}
                      type="number" placeholder="160"
                      value={form.goalWeight}
                      onChange={e => set('goalWeight', e.target.value)}
                    />
                    <span className={styles.inputUnit}>{form.unit}</span>
                  </div>
                  {errors.goalWeight && <span className={styles.err}>{errors.goalWeight}</span>}
                </div>
              </div>

              {currentBmi && (
                <div className={styles.bmiCard} style={{ borderColor: bmiInfo.color + '44' }}>
                  <div className={styles.bmiBadge} style={{ background: bmiInfo.color + '22', color: bmiInfo.color }}>
                    BMI {currentBmi} · {bmiInfo.label}
                  </div>
                  <div className={styles.bmiBar}>
                    {[
                      { label: 'Under', end: 18.5, color: '#60a5fa' },
                      { label: 'Healthy', end: 25, color: '#06d6a0' },
                      { label: 'Over', end: 30, color: '#fbbf24' },
                      { label: 'Obese', end: 40, color: '#f72585' },
                    ].map((seg, i, arr) => {
                      const start = i === 0 ? 10 : arr[i-1].end
                      const pct = Math.min(((seg.end - start) / 30) * 100, 40)
                      return (
                        <div key={seg.label} className={styles.bmiSeg} style={{ background: seg.color, flex: pct, opacity: 0.7 }} />
                      )
                    })}
                    <div className={styles.bmiMarker} style={{
                      left: `${Math.min(Math.max(((parseFloat(currentBmi) - 10) / 30) * 100, 0), 98)}%`,
                      background: bmiInfo.color
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className={styles.formStep}>
              <h2 className={styles.formTitle}>Your lifestyle.</h2>
              <p className={styles.formSub}>We'll calculate your personalized calorie targets.</p>

              <div className={styles.field}>
                <label>Activity Level</label>
                <div className={styles.activityGrid}>
                  {ACTIVITY_LEVELS.map(a => (
                    <button
                      key={a.value}
                      type="button"
                      className={`${styles.activityBtn} ${form.activityLevel === a.value ? styles.activityBtnActive : ''}`}
                      onClick={() => set('activityLevel', a.value)}
                    >
                      <span className={styles.activityLabel}>{a.label}</span>
                      <span className={styles.activityDesc}>{a.desc}</span>
                    </button>
                  ))}
                </div>
                {errors.activityLevel && <span className={styles.err}>{errors.activityLevel}</span>}
              </div>

              <div className={styles.field}>
                <label>Weekly Weight Loss Goal</label>
                <div className={styles.goalSliderWrap}>
                  <input
                    type="range" min="0.5" max="2" step="0.5"
                    value={form.weeklyGoal}
                    className={styles.goalSlider}
                    onChange={e => set('weeklyGoal', e.target.value)}
                  />
                  <div className={styles.goalLabels}>
                    <span>0.5 {form.unit}/wk</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{form.weeklyGoal} {form.unit}/wk</span>
                    <span>2 {form.unit}/wk</span>
                  </div>
                </div>
              </div>

              <div className={styles.summaryCard}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Starting</span>
                  <span className={styles.summaryVal}>{form.currentWeight} {form.unit}</span>
                </div>
                <div className={styles.summaryArrow}>→</div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Goal</span>
                  <span className={styles.summaryVal} style={{ color: 'var(--accent2)' }}>{form.goalWeight} {form.unit}</span>
                </div>
                <div className={styles.summaryArrow}>·</div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>To lose</span>
                  <span className={styles.summaryVal} style={{ color: 'var(--accent)' }}>
                    {Math.max(0, parseFloat(form.currentWeight || 0) - parseFloat(form.goalWeight || 0)).toFixed(1)} {form.unit}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className={styles.formActions}>
            {step > 1 && (
              <button className={styles.backBtn} onClick={() => setStep(s => s - 1)} type="button">
                ← Back
              </button>
            )}
            <button className={styles.nextBtn} onClick={next} type="button">
              {step === 3 ? `Let's Go, ${form.name || 'Champ'} 🔥` : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
