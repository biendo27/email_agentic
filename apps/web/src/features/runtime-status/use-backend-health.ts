import { useEffect, useState } from 'react'
import { checkHealth, HealthError } from './health-api'

type Connection =
  | { status: 'checking' }
  | { status: 'reachable'; checkedAt: Date }
  | { status: 'unavailable'; message: string }

export function useBackendHealth() {
  const [connection, setConnection] = useState<Connection>({ status: 'checking' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    void checkHealth(controller.signal).then(
      () => {
        if (active) setConnection({ status: 'reachable', checkedAt: new Date() })
      },
      (error: unknown) => {
        if (!active) return
        const message =
          error instanceof HealthError ? error.message : 'The connection check failed. Try again.'
        setConnection({ status: 'unavailable', message })
      },
    )
    return () => {
      active = false
      controller.abort()
    }
  }, [attempt])

  function refreshConnection() {
    setConnection({ status: 'checking' })
    setAttempt((previous) => previous + 1)
  }

  return { connection, refreshConnection }
}
