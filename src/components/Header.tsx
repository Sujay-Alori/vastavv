interface HeaderProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
}

export default function Header({ isMenuOpen, onToggleMenu }: HeaderProps) {
  return (
    <header className={`site-header ${isMenuOpen ? 'site-header--menu-open' : ''}`} role="banner">
      <div className="header-left">
        <a href="/" className="header-logo-link" aria-label="VASTAV Architects">
          <img
            src="/assets/brand/vastav-logo.png"
            alt="VASTAV"
            className="header-logo"
            width="2097"
            height="750"
          />
        </a>
      </div>

      <div className="header-center">
        <button
          type="button"
          className="header-menu-btn"
          onClick={onToggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          <span className={`menu-hamburger ${isMenuOpen ? 'menu-hamburger--open' : ''}`} aria-hidden="true">
            <span className="menu-line menu-line--top"></span>
            <span className="menu-line menu-line--bottom"></span>
          </span>
          <span className="menu-text">{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </div>

      <div className="header-right" aria-hidden="true" />
    </header>
  )
}
