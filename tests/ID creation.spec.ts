import { expect, test, type Locator } from '@playwright/test';

const firstName: string = 'Test';
const lastName: string = 'Use94';
const url: string = 'https://rahulshettyacademy.com/client/#/auth/login';
const email: string = `test${Date.now()}@gmail.com`;
const mobileNumber: string = '9912745133';
const password: string = 'Stek#12k';


test('Register User page', async ({ page }) => {
  await page.goto(url);
  await page.locator('a.text-reset').click();
  await page.locator('#firstName').fill(firstName);
  await page.locator('[placeholder="Last Name"]').fill(lastName);
  await page.locator('[placeholder="email@example.com"]').fill(email);
  await page.locator('#userMobile').fill(mobileNumber);
  await page.locator('select[formcontrolname="occupation"]').selectOption({ label: 'Student' });
  await page.locator("input[formcontrolname='gender'][value='Male']").check();
  await page.locator('#userPassword').fill(password);
  await page.locator('#confirmPassword').fill(password);
  await page.locator('input[type="checkbox"][formcontrolname="required"]').check();
  await page.getByRole('button', { name: 'Register', exact: true }).click();

  const registrationSuccessMessage: Locator = page.locator('h1.headcolor');
  await expect(registrationSuccessMessage).toHaveText('Account Created Successfully');
  console.log(await registrationSuccessMessage.textContent());
  console.log(`Account Created Successfully with the email: ${email} and password: ${password}`);

});
