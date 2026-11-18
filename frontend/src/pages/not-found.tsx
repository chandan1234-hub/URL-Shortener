import { NavLink } from 'react-router-dom'
import { routePaths } from '../route-links'

function NotFound() {
  return (
    <main className="shortener-page" id="main-content">
      <section className="shortener-content">
        <h1>That page isn’t here.</h1>
        <p className="shortener-description">
          The address may have changed. Head home or open the URL shortener.
        </p>
        <div className="not-found-links">
          <NavLink className="home-primary-link" to={routePaths.home}>
            Go home
          </NavLink>
          <NavLink className="site-nav-link" to={routePaths.shorten}>
            Shorten a URL
          </NavLink>
        </div>
      </section>
    </main>
  )
}

export default NotFound
