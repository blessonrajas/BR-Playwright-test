import { test, expect} from '@playwright/test';

const url: string = "https://rahulshettyacademy.com/loginpagePractise/";
const Username: string = "rahulshettyacademy";
const password: string = "Learning@830$3mK2";
const type: string = "admin";
const usertype: string = 'Consultant'


test('handles child window and main window', async ({ page }) => {
  await page.goto(url);

  const [childPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('a.blinkingText').first().click(),
  ]);

  // Wait until the popup finishes loading the DOM before checking it
  await childPage.waitForLoadState('domcontentloaded');

  await expect(childPage).toHaveURL(/documents-request/);
  await expect(
    childPage.locator('.im-para').filter({ hasText: 'We are offering free assistance of providing' })
  ).toContainText('We are offering free assistance of providing');
  await expect(childPage.getByRole('heading', { name: 'DOCUMENTS REQUEST' })).toBeVisible();
console.log('Child window opened and verified successfully.');

// Log in through the original page.
await page.locator('input[name="username"]').fill(Username);
await page.locator('#password').fill(password);
await page.getByRole('radio', { name: type }).check();
await page.locator('.form-control').filter({hasText:  usertype }).selectOption(usertype)
const termsCheckbox = page.getByRole('checkbox', {
  name: 'I Agree to the terms and conditions',
});

await termsCheckbox.check();
await expect(termsCheckbox).toBeChecked();
await page.getByRole('button', { name: 'Sign In' }).click();

console.log('Login completed successfully.');

await page.waitForLoadState('networkidle');
await expect(page.locator('.card-body h4 a').first()).toBeVisible();
const listedProductNames = await page.locator('.card-body h4 a').allTextContents();
console.log('Listed product names:', listedProductNames);


});
