import { expect, test, type Locator } from '@playwright/test';
import { POManager, type RegistrationDetails } from '../Pages/POManager';

const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey'];
const lastNames = ['Parker', 'Reed', 'Brooks', 'Hayes', 'Morgan'];


test('Register User page', async ({ page }) => {
  const registrationDetails: RegistrationDetails = {
    // Math.random() gives a value from 0 up to (but not including) 1.
    // Multiplying by the list length and flooring it gives a valid random array index.
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    // Pick the last name independently, so it can vary regardless of the first name.
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `test${Date.now()}@gmail.com`,
    mobileNumber: '9912745133',
    occupation: 'Student',
    gender: 'Male',
    password: 'Stek#12k',
  };

  const poManager = new POManager(page);
  const registerPage = poManager.getRegisterPage();

  await registerPage.openRegistrationForm();
  await registerPage.register(registrationDetails);

  const registrationSuccessMessage: Locator = page.locator('h1.headcolor');
  await expect(registrationSuccessMessage).toHaveText('Account Created Successfully');
  console.log(await registrationSuccessMessage.textContent());
  console.log(`Account Created Successfully with the email: ${registrationDetails.email}`);

});
