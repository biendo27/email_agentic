import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ServiceConnection } from './service-connection'

function aliveResponse() {
  return new Response(JSON.stringify({ status: 'alive' }))
}

describe('service connection', () => {
  it('recovers after a failed request through the refresh action', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new Error('private network details'))
      .mockResolvedValueOnce(aliveResponse())
    vi.stubGlobal('fetch', fetcher)
    render(<ServiceConnection />)

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Backend unavailable'))
    expect(screen.getByRole('status')).toHaveTextContent(
      'The backend could not be reached. Start the backend and try again.',
    )
    expect(screen.queryByText(/private network details/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Refresh connection' }))

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Backend reachable'))
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('cancels an outstanding check when the workspace unmounts', () => {
    let requestSignal: AbortSignal | null | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation((_input, init) => {
        requestSignal = init?.signal
        return new Promise<Response>((_resolve, reject) => {
          requestSignal?.addEventListener('abort', () => {
            reject(new DOMException('', 'AbortError'))
          })
        })
      }),
    )
    const { unmount } = render(<ServiceConnection />)
    unmount()
    expect(requestSignal?.aborted).toBe(true)
  })
})
