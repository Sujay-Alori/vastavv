import React from 'react'

export default function Footer() {
  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
    history.replaceState(null, '', window.location.pathname)
  }

  const handleScrollToProjects = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const projectsElement = document.getElementById('projects')
    if (!projectsElement) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerHeightPx =
      document.querySelector('.site-header')?.getBoundingClientRect().height || 84

    const elementTop = projectsElement.getBoundingClientRect().top + window.scrollY

    window.scrollTo({
      top: elementTop - headerHeightPx,
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
    history.replaceState(null, '', '#projects')
  }

  const handleScrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const contactElement = document.getElementById('contact')
    if (!contactElement) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const headerHeightPx =
      document.querySelector('.site-header')?.getBoundingClientRect().height || 84

    const elementTop = contactElement.getBoundingClientRect().top + window.scrollY

    window.scrollTo({
      top: elementTop - headerHeightPx,
      behavior: prefersReduced ? 'auto' : 'smooth',
    })
    history.replaceState(null, '', '#contact')
  }

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-main-grid">
          {/* Left: Brand Logo */}
          <div className="footer-brand-col">
            <a
              href="#"
              onClick={handleScrollToTop}
              className="footer-logo-link"
              aria-label="VASTAV ARCHITECTS - Back to top"
            >
              <img
                src="/assets/brand/vastav-logo.png"
                alt="VASTAV ARCHITECTS"
                className="footer-logo"
                width="2097"
                height="750"
              />
            </a>
          </div>

          {/* Center: Navigation Links */}
          <div className="footer-nav-col">
            <span className="footer-col-label">NAVIGATION</span>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="#"
                  onClick={handleScrollToTop}
                  className="footer-link"
                >
                  HOME
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={handleScrollToProjects}
                  className="footer-link"
                >
                  PORTFOLIO
                </a>
              </li>
              <li>
                <a
                  href="https://maps.app.goo.gl/Ln5wCoucCMv1qtwf8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  MAP
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={handleScrollToContact}
                  className="footer-link"
                >
                  CONTACT
                </a>
              </li>
            </ul>
          </div>

          {/* Right: Contact, Social & Studio Address */}
          <div className="footer-info-col">
            <div className="footer-info-group">
              <span className="footer-col-label">CALL</span>
              <a href="tel:+917025806797" className="footer-link footer-link--highlight">
                +91 70258 06797
              </a>
            </div>

            <div className="footer-info-group">
              <span className="footer-col-label">WHATSAPP</span>
              <a
                href="https://wa.me/917025806797"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                WhatsApp
              </a>
            </div>

            <div className="footer-info-group">
              <span className="footer-col-label">INSTAGRAM</span>
              <a
                href="https://www.instagram.com/vastavarchitects/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                @vastavarchitects
              </a>
            </div>

            <div className="footer-info-group footer-info-group--address">
              <span className="footer-col-label">ADDRESS</span>
              <address className="footer-address">
                Building no. 6E,<br />
                INTUC Bhavan,<br />
                Sea Port Road,<br />
                Kakkanad, Ernakulam,<br />
                Kerala
              </address>
            </div>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="footer-divider" aria-hidden="true" />

        {/* Bottom Bar: Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} VASTAV ARCHITECTS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
