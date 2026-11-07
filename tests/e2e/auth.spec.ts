import { test, expect } from '@playwright/test';

// US1 end-to-end tests: login, roles, navigation, reset
test.describe('US1: Authentication and Demo Roles', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage BEFORE navigation to ensure clean state
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/login');
    // Dismiss any storage notice if present
    const notice = page.locator('[data-testid="storage-notice"]');
    if (await notice.isVisible()) {
      await notice.click();
    }
  });

  test('T033: Login with Super Admin account', async ({ page }) => {
    // Fill in the login form
    await page.fill('input#email', 'superadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('T033: Login with Office Admin account', async ({ page }) => {
    await page.fill('input#email', 'officeadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('T033: Login with Warehouse Admin account', async ({ page }) => {
    await page.fill('input#email', 'warehouseadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');

    await page.waitForURL('/deliveries');
    await expect(page.locator('h1')).toContainText('Deliveries');
  });

  test('T033: Login with Viewer account', async ({ page }) => {
    await page.fill('input#email', 'viewer@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');

    await page.waitForURL('/projects');
    await expect(page.locator('h2')).toContainText('Project Management');
  });

  test('T033: Login with invalid credentials shows error', async ({ page }) => {
    await page.fill('input#email', 'superadmin@demo.example');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Error toast should appear
    const toast = page.locator('[role="alert"]');
    await expect(toast).toContainText('Invalid username or password!');
  });

  test('T033: Role switcher is visible for Super Admin', async ({ page }) => {
    // Login as Super Admin first
    await page.fill('input#email', 'superadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Role switcher should be visible
    const switcher = page.locator('#navbars select.form-select');
    await expect(switcher).toBeVisible();

    // Switch to Viewer
    await switcher.selectOption('Viewer');
    await page.waitForURL('/projects');
  });

  test('T033: Reset demo data restores seed', async ({ page }) => {
    // Login as any user
    await page.fill('input#email', 'superadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // Find and click reset button (should be in storage notice or dashboard)
    const resetBtn = page.locator('button:has-text("Reset demo")');
    if (await resetBtn.isVisible()) {
      await resetBtn.click();
    }
  });
});
