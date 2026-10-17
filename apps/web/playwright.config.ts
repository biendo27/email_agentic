import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'

const repositoryRoot = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    browserName: 'chromium',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command:
        'uv run --project apps/backend --locked uvicorn email_agentic.api.app:app --host 127.0.0.1 --port 8000',
      cwd: repositoryRoot,
      url: 'http://127.0.0.1:8000/healthz',
      reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
    {
      command: 'npm --prefix apps/web run dev',
      cwd: repositoryRoot,
      url: 'http://127.0.0.1:5173',
      reuseExistingServer: false,
      gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    },
  ],
})
