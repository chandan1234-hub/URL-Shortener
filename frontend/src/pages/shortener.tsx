import type { SyntheticEvent } from 'react'
import './shortener.css'

function Shortener() {
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="shortener-page">
      <header className="shortener-header">
        <a className="shortener-brand" href="/" aria-label="Shortener home">
          <svg
            aria-hidden="true"
            className="shortener-brand-icon"
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
          <span>Shortener</span>
        </a>
      </header>

      <main className="shortener-main">
        <section className="shortener-content" aria-labelledby="shortener-title">
          <h1 id="shortener-title">Shorten a URL</h1>
          <p className="shortener-description">
            Enter the long link you want to make easier to share.
          </p>

          <form className="shortener-form" onSubmit={handleSubmit}>
            <label htmlFor="url">Enter Your URL</label>
            <div className="shortener-form-row">
              <input
                autoComplete="url"
                id="url"
                name="url"
                placeholder="https://example.com/your-long-url"
                required
                type="url"
              />
              <button type="submit">Submit</button>
            </div>
            <p className="shortener-hint">
              Include the full link, such as https://example.com.
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Shortener
