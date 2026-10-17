import { useBackendHealth } from './use-backend-health'
import './service-connection.css'

export function ServiceConnection() {
  const { connection, refreshConnection } = useBackendHealth()
  const connectionLabel = {
    checking: 'Checking backend',
    reachable: 'Backend reachable',
    unavailable: 'Backend unavailable',
  }[connection.status]

  return (
    <aside className="service-panel" aria-labelledby="service-title">
      <div className="panel-heading">
        <h2 id="service-title">Service connection</h2>
      </div>
      <div className="service-content">
        <div className="service-label">
          <span>Backend</span>
          <span>HTTP liveness</span>
        </div>
        <div role="status" aria-live="polite" aria-atomic="true">
          <div className={`connection-state ${connection.status}`}>
            <span className="status-dot" aria-hidden="true" />
            <strong>{connectionLabel}</strong>
          </div>
          <div className="connection-detail">
            {connection.status === 'checking' && <p>Checking the connection to the backend…</p>}
            {connection.status === 'reachable' && (
              <>
                <p>The backend is responding. Research and integrations are not ready yet.</p>
                <p className="checked-time">
                  Checked at{' '}
                  <time dateTime={connection.checkedAt.toISOString()}>
                    {connection.checkedAt.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </time>
                </p>
              </>
            )}
            {connection.status === 'unavailable' && <p>{connection.message}</p>}
          </div>
        </div>
        <button
          className="button button-refresh"
          onClick={refreshConnection}
          disabled={connection.status === 'checking'}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M16 8a6 6 0 1 0-1 6M16 3v5h-5" />
          </svg>
          {connection.status === 'checking' ? 'Checking connection…' : 'Refresh connection'}
        </button>
        <p className="liveness-note">
          A reachable backend confirms only that the service is responding.
        </p>
      </div>
      <div className="integration-note">
        <h3>Email &amp; calendar</h3>
        <p>Gmail and Google Calendar connections are not available in this foundation.</p>
      </div>
    </aside>
  )
}
