import { useState, type FormEvent } from 'react'
import './shortener.css'

interface CreateShortUrlResponse {
  shortCode: string
  shortUrl: string
  longUrl: string
}

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '')

function isCreateShortUrlResponse(
  value: unknown,
): value is CreateShortUrlResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'shortCode' in value &&
    typeof value.shortCode === 'string' &&
    'shortUrl' in value &&
    typeof value.shortUrl === 'string' &&
    'longUrl' in value &&
    typeof value.longUrl === 'string'
  )
}

function getApiError(value: unknown) {
  if (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'string'
  ) {
    return value.error
  }
}

function Shortener() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<CreateShortUrlResponse | null>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setCopyStatus('')
    setResult(null)
    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const body: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          getApiError(body) ?? 'Unable to shorten this URL. Please try again.',
        )
      }

      if (!isCreateShortUrlResponse(body)) {
        throw new Error('The server returned an invalid response.')
      }

      setResult(body)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to reach the URL shortener. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function copyShortUrl() {
    if (!result) return

    try {
      await navigator.clipboard.writeText(result.shortUrl)
      setCopyStatus('Link copied to clipboard.')
    } catch {
      setCopyStatus('Could not copy automatically. Select the link to copy it.')
    }
  }

  return (
    <main className="shortener-page" id="main-content">
      <section className="shortener-content" aria-labelledby="shortener-title">
        <h1 id="shortener-title">Shorten a URL</h1>
        <p className="shortener-description">
          Enter the long link you want to make easier to share.
        </p>

        <form
          aria-busy={isSubmitting}
          className="shortener-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="url">Enter Your URL</label>
          <div className="shortener-form-row">
            <input
              autoComplete="url"
              id="url"
              name="url"
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/your-long-url"
              required
              type="url"
              value={url}
            />
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Shortening…' : 'Shorten URL'}
            </button>
          </div>
          <p className="shortener-hint">
            Include the full link, such as https://example.com.
          </p>
        </form>

        {error && (
          <p className="shortener-error" role="alert">
            {error}
          </p>
        )}

        {result && (
          <section
            aria-labelledby="shortener-result-title"
            className="shortener-result"
            aria-live="polite"
          >
            <h2 id="shortener-result-title">Your short link is ready</h2>
            <div className="shortener-result-row">
              <a
                className="shortener-result-link"
                href={result.shortUrl}
                rel="noreferrer"
                target="_blank"
              >
                {result.shortUrl}
              </a>
              <button
                className="shortener-copy-button"
                onClick={copyShortUrl}
                type="button"
              >
                Copy link
              </button>
            </div>
            <p className="shortener-result-original">
              Original URL: <span>{result.longUrl}</span>
            </p>
            <p className="shortener-copy-status" aria-live="polite">
              {copyStatus}
            </p>
          </section>
        )}
      </section>
    </main>
  )
}

export default Shortener
