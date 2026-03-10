// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Tenant Setup Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Tenant Setup' }).click();
  });

  test('should display tenant setup heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tenant Setup' })).toBeVisible();
    await expect(page.getByText('Configure and provision customer tenant')).toBeVisible();
  });

  test('should show customer selector', async ({ page }) => {
    await expect(page.getByLabel('Select Customer')).toBeVisible();
  });

  test('should display tenant plan and status selectors', async ({ page }) => {
    await expect(page.getByLabel('Plan')).toBeVisible();
    await expect(page.getByLabel('Status')).toBeVisible();
  });

  test('should display tenant ID', async ({ page }) => {
    await expect(page.getByText('Tenant ID:')).toBeVisible();
  });

  test('should save tenant configuration', async ({ page }) => {
    // Wait for tenant data to load
    await expect(page.getByLabel('Plan')).toBeVisible();

    // Change plan
    await page.getByLabel('Plan').selectOption('enterprise');

    // Click save
    await page.getByRole('button', { name: 'Save Tenant Configuration' }).click();

    // Verify success message
    await expect(page.getByText('Tenant configuration saved successfully')).toBeVisible({ timeout: 10000 });
  });

  test('should show save button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Tenant Configuration' })).toBeVisible();
  });
});
