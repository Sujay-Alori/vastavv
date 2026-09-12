import React, { useEffect, useCallback } from 'react'

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface NavItem {
  label: string
  href: string
  externalUrl?: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '#' },
  { label: 'PORTFOLIO', href: '#projects' },
  {
    label: 'MAP',
    href: 'https://maps.app.goo.gl/Ln5wCoucCMv1qtwf8',
    externalUrl: 'https://maps.app.goo.gl/Ln5wCoucCMv1qtwf8',
  },
  { label: 'CONTACT', href: '#contact' },
]

// Duration of the curtain close animation (must match CSS transition: 0.8s)
const CURTAIN_CLOSE_MS = 820

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

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      // External links (MAP): open in new tab and close the curtain
      if (item.externalUrl) {
        e.preventDefault()
        window.open(item.externalUrl, '_blank', 'noopener,noreferrer')
        onClose()
        return
      }

      // Internal links: smooth scroll after curtain closes
      e.preventDefault()

      // Close the curtain immediately
      onClose()

      // Respect prefers-reduced-motion: skip delay when animations are off
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
      const delay = prefersReduced ? 0 : CURTAIN_CLOSE_MS

      if (item.label === 'HOME' || item.href === '#') {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: prefersReduced ? 'auto' : 'smooth',
          })
          history.replaceState(null, '', window.location.pathname)
        }, delay)
        return
      }

      const targetId = item.href.replace('#', '')
      const target = document.getElementById(targetId)
      if (!target) return

      setTimeout(() => {
        const headerHeightPx =
          document.querySelector('.site-header')?.getBoundingClientRect().height || 84

        const elementTop =
          target.getBoundingClientRect().top + window.scrollY

        window.scrollTo({
          top: elementTop - headerHeightPx,
          behavior: prefersReduced ? 'auto' : 'smooth',
        })

        // Update the browser URL hash without triggering a jump
        history.replaceState(null, '', item.href)
      }, delay)
    },
    [onClose]
  )

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
                  {...(item.externalUrl
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  onClick={(e) => handleNavClick(e, item)}
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
