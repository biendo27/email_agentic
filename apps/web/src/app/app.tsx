import { ServiceConnection } from '../features/runtime-status'
import './app.css'

export default function App() {
  return (
    <div className="application">
      <a className="skip-link" href="#workspace">
        Skip to workspace
      </a>
      <header className="site-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            ea
          </span>
          <span>Email Agentic</span>
        </div>
        <span className="environment-label">Development foundation</span>
      </header>

      <main id="workspace" className="main-content">
        <div className="page-heading">
          <p className="eyebrow">Research workspace</p>
          <h1>Prepare with context.</h1>
          <p className="page-description">
            Customer research, grounded in sources and ready for your review.
          </p>
        </div>

        <section className="evidence-path" aria-label="Planned research workflow">
          <span className="path-label">Planned workflow</span>
          <ol>
            <li>Email context</li>
            <li>Source evidence</li>
            <li>Draft for review</li>
          </ol>
        </section>

        <div className="workspace-grid">
          <section className="research-panel" aria-labelledby="research-title">
            <div className="panel-heading">
              <h2 id="research-title">Meeting research</h2>
              <span className="quiet-label">Not available yet</span>
            </div>
            <div className="research-empty">
              <svg
                className="context-illustration"
                viewBox="0 0 88 88"
                fill="none"
                aria-hidden="true"
              >
                <rect x="17" y="13" width="54" height="62" rx="6" />
                <path d="M29 29h30M29 39h22M29 49h14M29 62h30" />
                <circle cx="65" cy="59" r="13" />
                <path d="m60 59 3 3 6-6" />
              </svg>
              <p className="section-kicker">A clear starting point</p>
              <h3>No research runs yet.</h3>
              <p className="empty-description" id="research-unavailable">
                Email selection and research are not connected yet. Once available, this space will
                hold a cited draft for you to review.
              </p>
              <button
                className="button button-unavailable"
                disabled
                aria-describedby="research-unavailable"
              >
                Select an email
              </button>
              <p className="privacy-note">No inbox content has been loaded.</p>
            </div>
            <div className="research-footer">
              <span>Sources before conclusions.</span>
              <span>Your review before action.</span>
            </div>
          </section>

          <ServiceConnection />
        </div>
      </main>
    </div>
  )
}
