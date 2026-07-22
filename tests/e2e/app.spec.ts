import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('renders the title and description', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toContainText('PromptPilot')
    await expect(page.locator('p')).toContainText('AI-powered software planning pipeline')
    await expect(page.locator('text=Get Started')).toBeVisible()
    await expect(page.locator('text=Sign In')).toBeVisible()
  })

  test('navigates to sign in page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sign In')

    await expect(page).toHaveURL(/\/login/)
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('navigates to register page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Get Started')

    await expect(page).toHaveURL(/\/register/)
    await expect(page.locator('h1')).toContainText('Create Account')
  })
})

test.describe('Login Page', () => {
  test('shows validation errors for empty form', async ({ page }) => {
    await page.goto('/login')
    await page.click('button:has-text("Sign In")')

    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('has link to register page', async ({ page }) => {
    await page.goto('/login')
    await page.click('text=Create one')

    await expect(page).toHaveURL(/\/register/)
  })
})

test.describe('Register Page', () => {
  test('shows password mismatch error', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[placeholder="Your full name"]', 'Test User')
    await page.fill('input[placeholder="you@example.com"]', 'test@example.com')
    await page.fill('input[placeholder="At least 8 characters"]', 'password123')
    await page.fill('input[placeholder="Re-enter your password"]', 'different')
    await page.click('button:has-text("Create Account")')

    await expect(page.locator('text=Passwords do not match')).toBeVisible()
  })

  test('has link to login page', async ({ page }) => {
    await page.goto('/register')
    await page.click('text=Sign in')

    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Dashboard Page', () => {
  test('redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Privacy Page', () => {
  test('renders privacy policy content', async ({ page }) => {
    await page.goto('/privacy')

    await expect(page.locator('h1')).toContainText('Privacy Policy')
    await expect(page.locator('h2')).toHaveCount(4)
  })
})
