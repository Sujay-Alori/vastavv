import { useState, useEffect } from 'react'
import Header from './components/Header'
import MenuOverlay from './components/MenuOverlay'
import Hero from './components/Hero'
import Studio from './components/Studio'
import Contact from './components/Contact'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      {isLoading && (
        <div className="preloader" role="status" aria-label="Loading VASTAV">
          <img
            src="/assets/brand/vastav-logo.png"
            alt="VASTAV"
            className="preloader-logo"
            width="2097"
            height="750"
          />
        </div>
      )}

      {!isLoading && (
        <>
          <Header isMenuOpen={isMenuOpen} onToggleMenu={toggleMenu} />
          <MenuOverlay isOpen={isMenuOpen} onClose={closeMenu} />
          <main className="homepage" aria-label="VASTAV">
            <Hero />
            <Studio />
            <Contact />
          </main>
        </>
      )}
    </>
  )
}
