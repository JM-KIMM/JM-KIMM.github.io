import { ReactNode, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { getPageTitle, pageCategories } from '../data/navigation'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('jm-theme')
  if (saved === 'light' || saved === 'dark') return saved
  return 'light'
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('jm-theme', theme)
  }, [theme])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="nav-wrap">
          <NavLink className="brand" to="/" aria-label="김진명 포트폴리오 홈">
            <span className="brand-mark">JM</span><span className="brand-dot">.</span>
          </NavLink>
          <nav id="primary-navigation" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="주요 메뉴">
            {pageCategories.map((category) => (
              <NavLink key={category.id} to={category.path} end={category.path === '/'}>
                <span>{category.label}</span>
                <small>{category.description}</small>
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              className="theme-button"
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              aria-label={theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환'}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              <span aria-hidden="true">{theme === 'light' ? '●' : '○'}</span>
            </button>
            <a className="nav-github" href="https://github.com/JM-KIMM" target="_blank" rel="noreferrer">GitHub ↗</a>
            <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation">
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-identity"><b>김진명</b></div>
        <div className="footer-links">
          <a href="mailto:wlsahd1330@naver.com">Email</a>
          <a href="https://github.com/JM-KIMM" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://huggingface.co/jmjmjm3" target="_blank" rel="noreferrer">Hugging Face</a>
          <a href="https://dacon.io/myprofile/506325/competition" target="_blank" rel="noreferrer">Dacon</a>
        </div>
        <small>© {new Date().getFullYear()} Jinmyung Kim</small>
      </footer>
    </div>
  )
}
