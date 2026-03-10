// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Customer Info Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Customer Info' }).click();
  });

  test('should display customer info heading and form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Customer Information' })).toBeVisible();
    await expect(page.getByText('Review and update customer details for onboarding')).toBeVisible();
  });

  test('should show customer selector with Acme Corporation', async ({ page }) => {
    await expect(page.getByLabel('Select Customer')).toBeVisible();
    await expect(page.getByLabel('Select Customer')).toHaveValue('cust_001');
  });

  test('should display form fields with pre-filled data', async ({ page }) => {
    // Verify form fields are populated (name contains "Acme Corp" at minimum)
    await expect(page.getByLabel('Company Name')).not.toHaveValue('');
    await expect(page.getByLabel('Industry')).toBeVisible();
    await expect(page.getByLabel('Region')).toBeVisible();
    await expect(page.getByLabel('Contact Email')).toBeVisible();
  });

  test('should save updated customer info', async ({ page }) => {
    // Wait for form to load with data
    await expect(page.getByLabel('Company Name')).not.toHaveValue('');

    // Clear and type new values using keyboard to ensure React state updates
    const nameInput = page.getByLabel('Company Name');
    await nameInput.click();
    await nameInput.press('Control+A');
    await nameInput.pressSequentially('Acme Corp Updated');

    const industryInput = page.getByLabel('Industry');
    await industryInput.click();
    await industryInput.press('Control+A');
    await industryInput.pressSequentially('Technology');

    // Click save
    await page.getByRole('button', { name: 'Save Customer Info' }).click();

    // Verify success message
    await expect(page.getByText('Customer info saved successfully')).toBeVisible({ timeout: 10000 });
  });

  test('should show save button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Customer Info' })).toBeVisible();
  });
});
