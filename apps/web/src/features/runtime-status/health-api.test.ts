import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkHealth, HealthError } from './health-api'

function response(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => vi.useRealTimers())

describe('backend health boundary', () => {
  it('checks the same-origin endpoint without caching', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response({ status: 'alive' }))
    vi.stubGlobal('fetch', fetcher)

    await expect(checkHealth(new AbortController().signal)).resolves.toEqual({
      status: 'alive',
    })
    expect(fetcher).toHaveBeenCalledOnce()
    expect(fetcher.mock.calls[0]?.[0]).toBe('/healthz')
    const options = fetcher.mock.calls[0]?.[1]
    expect(options?.signal).toBeInstanceOf(AbortSignal)
    expect(options?.cache).toBe('no-store')
    expect(options?.headers).toEqual({ Accept: 'application/json' })
  })

  it.each([null, [], {}, { status: 'ready' }, { status: 1 }])(
    'rejects an invalid success payload: %j',
    async (value) => {
      vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response(value)))
      await expect(checkHealth(new AbortController().signal)).rejects.toMatchObject({
        code: 'invalid-response',
      })
    },
  )

  it('reports malformed JSON as invalid instead of exposing the body', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(new Response('private body')))
    await expect(checkHealth(new AbortController().signal)).rejects.toMatchObject({
      code: 'invalid-response',
    })
  })

  it('does not expose non-success response content', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockResolvedValue(response('private body', 503)))
    await expect(checkHealth(new AbortController().signal)).rejects.toEqual(
      new HealthError('unavailable'),
    )
  })

  it('does not expose network exception details', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(new Error('private detail')))
    await expect(checkHealth(new AbortController().signal)).rejects.toEqual(
      new HealthError('unavailable'),
    )
  })

  it('does not call fetch for an already-cancelled check', async () => {
    const fetcher = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fetcher)
    const controller = new AbortController()
    controller.abort()
    await expect(checkHealth(controller.signal)).rejects.toMatchObject({ code: 'cancelled' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it.each(['timeout', 'cancelled'] as const)('aborts an active request on %s', async (reason) => {
    vi.useFakeTimers()
    let requestSignal: AbortSignal | null | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(
        (_input, init) =>
          new Promise<Response>((_resolve, reject) => {
            requestSignal = init?.signal
            requestSignal?.addEventListener('abort', () => {
              reject(new DOMException('', 'AbortError'))
            })
          }),
      ),
    )
    const controller = new AbortController()
    const result = expect(checkHealth(controller.signal)).rejects.toMatchObject({
      code: reason,
    })

    if (reason === 'timeout') await vi.advanceTimersByTimeAsync(5_000)
    else controller.abort()

    await result
    expect(requestSignal?.aborted).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })
})
