import React, { useState } from 'react'
import styles from './Nav.module.css'

export default function Nav({ page, setPage, user, onReset }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>FP</div>
          <span className={styles.appName}>FormPeak</span>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${page === 'dashboard' ? styles.tabActive : ''}`}
            onClick={() => setPage('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`${styles.tab} ${page === 'food' ? styles.tabActive : ''}`}
            onClick={() => setPage('food')}
          >
            🍽 Food Journal
          </button>
        </div>

        <div className={styles.right}>
          <div className={styles.userChip} onClick={() => setMenuOpen(m => !m)}>
            <div className={styles.avatar}>{user.name[0].toUpperCase()}</div>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.chevron}>{menuOpen ? '▲' : '▼'}</span>
          </div>
          {menuOpen && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownInfo}>
                <p className={styles.dropdownName}>{user.name}</p>
                <p className={styles.dropdownSub}>{user.gender} · {user.age}y · {user.heightFt}'{user.heightIn}"</p>
              </div>
              <div className={styles.dropdownDivider} />
              <button className={styles.dropdownItem} onClick={() => { onReset(); setMenuOpen(false) }}>
                🔄 Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
