// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Onboarding Dashboard', () => {
  test('should display the dashboard heading', async ({ page }) => {
    await page.goto('/');

    // Verify the main heading is visible
    await expect(page.locator('h1')).toContainText('Onboarding Dashboard');
  });

  test('should show navigation tabs', async ({ page }) => {
    await page.goto('/');

    // Verify all navigation tabs are present
    await expect(page.locator('.tab')).toHaveCount(5);
    await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Customer Info' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Data Mapping' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tenant Setup' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Import' })).toBeVisible();
  });

  test('should display example customer in onboarding queue', async ({ page }) => {
    await page.goto('/');

    // Wait for data to load and verify example customer is shown
    await expect(page.locator('.customer-card')).toBeVisible();
    await expect(page.locator('.customer-card h3')).toContainText('Acme Corp');
  });

  test('should switch between tabs', async ({ page }) => {
    await page.goto('/');

    // Click on Customer Info tab
    await page.getByRole('button', { name: 'Customer Info' }).click();
    
    // Verify customer info content is shown (no longer a placeholder)
    await expect(page.getByRole('heading', { name: 'Customer Information' })).toBeVisible();
  });

  test('should navigate to customer info when clicking View Details', async ({ page }) => {
    await page.goto('/');

    // Wait for the customer card to load
    await expect(page.locator('.customer-card')).toBeVisible();

    // Click View Details button
    await page.getByRole('button', { name: 'View Details' }).click();

    // Should navigate to Customer Info tab with customer data
    await expect(page.getByRole('heading', { name: 'Customer Information' })).toBeVisible();
    await expect(page.getByLabel('Company Name')).toBeVisible();
  });
});
