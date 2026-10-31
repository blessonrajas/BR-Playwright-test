import { test, expect } from '@playwright/test';

const FirstName = 'Test';
const LastName = 'Use94';
const url = 'https://rahulshettyacademy.com/client/#/auth/login'
const email = `test${Date.now()}@gmail.com`;
const mobilenumber= '9912745133'
const password='Stek#12k'


test('Register User page', async ({ page }) => {
  await page.goto(url);
  await page.locator('a.text-reset').click();
  await page.locator('#firstName').fill(FirstName);
  await page.locator('[placeholder="Last Name"]').fill(LastName);
  await page.locator('[placeholder="email@example.com"]').fill(email);
  await page.locator('#userMobile').fill(mobilenumber);
  await page.locator('select[formcontrolname="occupation"]').selectOption({ label: 'Student' });
  await page.locator("input[formcontrolname='gender'][value='Male']").check();
  await page.locator('#userPassword').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.locator('input[type="checkbox"][formcontrolname="required"]').check();
  await page.getByRole('button', { name: 'Register', exact: true }).click();

  await expect(page.locator('h1.headcolor')).toHaveText('Account Created Successfully');
  console.log(await page.locator('h1.headcolor').textContent());
 console.log("Account Created Successfully with the email: " + email + " and password: " + password);

})
