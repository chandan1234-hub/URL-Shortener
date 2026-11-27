import { NavLink } from 'react-router-dom'
import { routePaths } from '../route-links'
import './home.css'

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M3.75 10h12.5m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Home() {
  return (
    <main className="home-main" id="main-content">
      <section aria-labelledby="home-title" className="home-hero">
        <div className="home-copy">
          <h1 id="home-title">Long links, made easy to share.</h1>
          <p>
            Turn a long web address into a compact, shareable link that is easier
            to read, send, and remember.
          </p>
          <NavLink className="home-primary-link" to={routePaths.shorten}>
            Shorten a link
            <ArrowIcon />
          </NavLink>
        </div>

        <div
          aria-label="Illustrative example of a long URL becoming a shorter link"
          className="link-visual"
          role="img"
        >
          <div className="link-visual-heading">
            <span className="link-visual-mark" />
            <span>One link, simplified</span>
          </div>

          <div className="link-example">
            <div className="link-example-row">
              <span className="link-example-label">LONG URL</span>
              <p>example.com/articles/a-really-long-address</p>
            </div>
            <div aria-hidden="true" className="link-connector">
              <span />
              <ArrowIcon />
              <span />
            </div>
            <div className="link-example-row link-example-result">
              <span className="link-example-label">SHORTER LINK</span>
              <p>
                <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                  <path
                    d="m8 12 4-4m-5.8 6.1-1.1 1.1a3.1 3.1 0 0 1-4.4-4.4l3.1-3.1a3.1 3.1 0 0 1 4.4 0m2.8-1.8 1.1-1.1a3.1 3.1 0 0 1 4.4 4.4l-3.1 3.1a3.1 3.1 0 0 1-4.4 0"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                your-short-link
              </p>
            </div>
          </div>
          <p className="link-visual-caption">An illustrative example</p>
        </div>
      </section>

      <section aria-label="How link shortening helps" className="home-note">
        <h2>A little less URL. A little more room.</h2>
        <p>
          Keep the focus on what you want to share, not the length of the
          address.
        </p>
      </section>
    </main>
  )
}

export default Home
