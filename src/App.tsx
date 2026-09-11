import { useState, useEffect } from 'react'
import Header from './components/Header'
import MenuOverlay from './components/MenuOverlay'
import Hero from './components/Hero'
import Studio from './components/Studio'
import Contact from './components/Contact'

export default function App() {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isPreloaded, setIsPreloaded] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const duration = 2600 // ~2.6s smooth progression
    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const raw = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(raw)

      if (raw < 100) {
        frameId = requestAnimationFrame(tick)
      } else {
        // Hold 100% for 250ms, then start smooth fade
        setTimeout(() => {
          setIsExiting(true)
          // Unmount preloader after transition finishes (600ms)
          setTimeout(() => {
            setIsPreloaded(true)
          }, 600)
        }, 250)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  // Lock body scroll while preloader is active or menu is open
  useEffect(() => {
    if (!isPreloaded || isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isPreloaded, isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {!isPreloaded && (
        <div
          className={`preloader ${isExiting ? 'preloader--exiting' : ''}`}
          role="status"
          aria-label="Loading VASTAV ARCHITECTS"
          aria-live="polite"
        >
          <div className="preloader-content">
            <img
              src="/assets/brand/vastav-logo.png"
              alt="VASTAV ARCHITECTS"
              className="preloader-logo"
              width="2097"
              height="750"
            />
            <div className="preloader-progress-wrapper">
              <div className="preloader-line-track">
                <div
                  className="preloader-line-fill"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
              <div className="preloader-line-labels">
                <span className="preloader-label-current">{progress}%</span>
                <span className="preloader-label-total">100%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Header isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
      <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
      <main className="homepage" aria-label="VASTAV">
        <Hero />
        <Studio />
        <Contact />
      </main>
    </>
  )
}
