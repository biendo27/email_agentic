import { expect, test } from '@playwright/test'

for (const width of [375, 768, 1440]) {
  test(`connects to the real backend at ${String(width)}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const responsePromise = page.waitForResponse((response) => response.url().endsWith('/healthz'))
    await page.goto('/')
    const response = await responsePromise
    expect(response.status()).toBe(200)
    const payload: unknown = await response.json()
    expect(payload).toEqual({ status: 'alive' })
    await expect(
      page.getByRole('status').getByText('Backend reachable', { exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Select an email' })).toBeDisabled()
    await expect(page.getByText('No inbox content has been loaded.')).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}

test('supports keyboard access and refreshes the real connection', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.getByRole('status').getByText('Backend reachable', { exact: true }),
  ).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to workspace' })).toBeFocused()
  await page.keyboard.press('Tab')
  const refresh = page.getByRole('button', { name: 'Refresh connection' })
  await expect(refresh).toBeFocused()
  const responsePromise = page.waitForResponse((response) => response.url().endsWith('/healthz'))
  await page.keyboard.press('Enter')
  expect((await responsePromise).status()).toBe(200)
  await expect(
    page.getByRole('status').getByText('Backend reachable', { exact: true }),
  ).toBeVisible()
  await expect(refresh).toBeEnabled()
})
