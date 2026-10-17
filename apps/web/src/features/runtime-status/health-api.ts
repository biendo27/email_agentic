export interface HealthResponse {
  status: 'alive'
}

export type HealthErrorCode = 'unavailable' | 'timeout' | 'invalid-response' | 'cancelled'

const messages: Record<HealthErrorCode, string> = {
  unavailable: 'The backend could not be reached. Start the backend and try again.',
  timeout: 'The connection check timed out. Try again when the backend is available.',
  'invalid-response':
    'The backend returned an unexpected response. Check the service and try again.',
  cancelled: 'The connection check was cancelled.',
}

export class HealthError extends Error {
  readonly code: HealthErrorCode

  constructor(code: HealthErrorCode) {
    super(messages[code])
    this.name = 'HealthError'
    this.code = code
  }
}

export function parseHealthResponse(value: unknown): HealthResponse {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('status' in value) ||
    value.status !== 'alive'
  ) {
    throw new HealthError('invalid-response')
  }
  return { status: 'alive' }
}

export async function checkHealth(signal: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController()
  const cancel = () => {
    controller.abort('cancelled')
  }
  if (signal.aborted) throw new HealthError('cancelled')
  signal.addEventListener('abort', cancel, { once: true })
  const timeout = setTimeout(() => {
    controller.abort('timeout')
  }, 5_000)

  try {
    const response = await fetch('/healthz', {
      signal: controller.signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) throw new HealthError('unavailable')
    let value: unknown
    try {
      value = await response.json()
    } catch {
      throw new HealthError('invalid-response')
    }
    return parseHealthResponse(value)
  } catch (error: unknown) {
    if (controller.signal.aborted) {
      throw new HealthError(controller.signal.reason === 'timeout' ? 'timeout' : 'cancelled')
    }
    if (error instanceof HealthError) throw error
    throw new HealthError('unavailable')
  } finally {
    clearTimeout(timeout)
    signal.removeEventListener('abort', cancel)
  }
}
