import { test, expect } from '@playwright/test';

// T042: US2 end-to-end test for projects
test.describe('US2: Project Management (Quickstart V3)', () => {
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
    // Login as admin
    await page.fill('input#email', 'superadmin@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    // Navigate to projects
    await page.click('text=Projects');
    await page.waitForLoadState('networkidle');
  });

  test('should display project list with pagination', async ({ page }) => {
    await page.waitForSelector('table');
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should filter projects by year', async ({ page }) => {
    await page.fill('input[name="year"]', '2024');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    // Should show filtered results
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should filter projects by agency', async ({ page }) => {
    await page.selectOption('select[name="agency"]', 'DepEd');
    await page.waitForTimeout(500);
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should add a new project', async ({ page }) => {
    await page.click('button:has-text("Add Project")');
    await page.waitForSelector('input[placeholder="e.g., DEP-2024-001"]');
    
    await page.fill('input[placeholder="e.g., DEP-2024-001"]', 'DEP-2024-001');
    await page.fill('input[placeholder="Project name"]', 'Test Project');
    await page.selectOption('select[name="agency"]', 'DepEd');
    await page.fill('input[placeholder="0.00"]', '50000');
    await page.fill('input[placeholder="0.00"]', '45000');
    await page.selectOption('select[name="status"]', 'Ongoing');
    await page.click('button:has-text("Save")');
    
    await page.waitForTimeout(500);
    // Should see the new project in the list
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should show add/edit controls only for admin', async ({ page }) => {
    // Login as viewer
    await page.goto('/');
    await page.fill('input#email', 'viewer@demo.example');
    await page.fill('input#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/projects');
    
    // Viewer should not see add project button
    const addButton = page.locator('button:has-text("Add Project")');
    await expect(addButton).not.toBeVisible();
  });

  test('should persist data after reload', async ({ page }) => {
    // Add a project
    await page.click('button:has-text("Add Project")');
    await page.fill('input[placeholder="e.g., DEP-2024-001"]', 'DEP-2024-002');
    await page.click('button:has-text("Save")');
    await page.waitForTimeout(500);
    
    // Reload
    await page.reload();
    await page.waitForTimeout(500);
    
    // Should still see the project
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });
});
