import type { SyntheticEvent } from 'react'
import './shortener.css'

function Shortener() {
  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <main className="shortener-page" id="main-content">
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
  )
}

export default Shortener
