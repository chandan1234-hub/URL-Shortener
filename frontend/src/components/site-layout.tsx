import { NavLink, Outlet } from 'react-router-dom'
import { pageLinks, routePaths } from '../route-links'
import './site-layout.css'

function LinkMark() {
  return (
    <svg
      aria-hidden="true"
      className="site-brand-mark"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M13.2 18.8 18.8 13.2M11.5 21.3l-1.1 1.1a5 5 0 0 1-7.1-7.1l5-5a5 5 0 0 1 7.1 0m5.1.4 1.1-1.1a5 5 0 0 1 7.1 7.1l-5 5a5 5 0 0 1-7.1 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SiteLayout() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <NavLink
          aria-label="Shortener home"
          className="site-brand"
          to={routePaths.home}
        >
          <LinkMark />
          <span>Shortener</span>
        </NavLink>

        <nav aria-label="Main navigation" className="site-navigation">
          {pageLinks.map(({ label, to }) => (
            <NavLink
              className={({ isActive }) =>
                `site-nav-link${isActive ? ' is-active' : ''}`
              }
              end={to === routePaths.home}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <div className="site-content">
        <Outlet />
      </div>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <NavLink className="site-footer-brand" to={routePaths.home}>
            <LinkMark />
            <span>Shortener</span>
          </NavLink>
          <p>Long links, made easier to share.</p>
          <nav aria-label="Footer navigation" className="site-footer-links">
            {pageLinks.map(({ label, to }) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

export default SiteLayout
