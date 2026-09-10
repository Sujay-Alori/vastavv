import React, { useEffect } from 'react'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'PROJECTS', href: '#projects' },
  { label: 'MAP', href: '#map' },
  { label: 'CONTACT', href: '#contact' },
]

export default function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={`menu-curtain ${isOpen ? 'menu-curtain--open' : ''}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Site Navigation"
    >
      <div className="menu-curtain-inner">
        <nav className="menu-nav" aria-label="Overlay Navigation">
          <ul className="menu-nav-list">
            {NAV_ITEMS.map((item, index) => (
              <li
                key={item.label}
                className="menu-nav-item"
                style={{ '--item-index': index } as React.CSSProperties}
              >
                <a
                  href={item.href}
                  className="menu-nav-link"
                  tabIndex={isOpen ? 0 : -1}
                  onClick={(e) => {
                    e.preventDefault()
                    onClose()
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
