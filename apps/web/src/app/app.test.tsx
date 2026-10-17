import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './app'

function aliveResponse() {
  return new Response(JSON.stringify({ status: 'alive' }))
}

describe('research workspace', () => {
  it('shows a pending check and keeps unimplemented research unavailable', async () => {
    let finishCheck: (response: Response) => void = () => undefined
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>().mockImplementation(
        () =>
          new Promise<Response>((resolve) => {
            finishCheck = resolve
          }),
      ),
    )
    render(<App />)

    expect(screen.getByRole('button', { name: /checking connection/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Select an email' })).toBeDisabled()
    expect(screen.getByText('No inbox content has been loaded.')).toBeVisible()

    finishCheck(aliveResponse())
    expect(await screen.findByRole('button', { name: 'Refresh connection' })).toBeEnabled()
    expect(screen.getByRole('status')).toHaveTextContent('Backend reachable')
    expect(screen.getByText(/research and integrations are not ready yet/i)).toBeVisible()
  })
})
