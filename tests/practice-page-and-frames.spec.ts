import { test, expect } from '@playwright/test';

const url: string = "https://rahulshettyacademy.com/AutomationPractice/";
const radiobutton : string = 'radio3'
const typecountry: string = 'Ind'
const country: string = 'India'
const dropdownoption : string = 'option2'
const checkbox : string = '#checkBoxOption3'
const username : string = 'Test User'
const hoveroption: string = 'Top'
const expected: { name: string; position: string; city: string; amount: string } = {
  name: 'Alex',
  position: 'Engineer',
  city: 'Chennai',
  amount: '28',
};
const iframeSelector: string = '#courses-iframe';
const expectedLinkName: string = 'Courses';


test('playwright test practice and frames', async ({page}) => {

// Open the practice page
await page.goto(url);

// Select a radio button
await page.locator(`input[value="${radiobutton}"]`).check();

// Choose a country from autocomplete
await page.locator('#autocomplete').pressSequentially(typecountry);
await page.getByText(country, { exact: true }).click();

// Select a dropdown option and checkbox
await page.locator('#dropdown-class-example').selectOption(dropdownoption);
await page.locator(checkbox).check();

// Accept the alert
await page.locator('#name').fill(username);
page.on('dialog', dialog => dialog.accept());
await page.locator('#alertbtn').click();

// Verify the textbox hide and show behavior
await page.locator('#hide-textbox').click();
await expect(page.locator('#displayed-text')).toBeHidden();
await page.locator('#show-textbox').click();
await expect(page.locator('#displayed-text')).toBeVisible();

// Print the course table rows
const rows = await page.locator('table[name="courses"] tbody tr').allTextContents();
console.log(rows);

// Find and validate all values in the selected employee row (table)
const row = page.locator('.tableFixHead tbody tr').filter({
  has: page.getByRole('cell', { name: expected.name, exact: true }),
});
await expect(row).toHaveCount(1);
const actualValues = await row.locator('td').allTextContents();
console.log('Matched row:', actualValues);
expect(actualValues).toEqual([
  expected.name,
  expected.position,
  expected.city,
  expected.amount,
]);

// Hover and open the Top link
await page.locator('#mousehover').hover();
await page.getByRole('link', { name: hoveroption }).click();

// Print the course names and prices
const rows1 = await page.locator('table[name="courses"] tbody tr').allTextContents();
console.log(rows1.slice(1));

// Check that the Courses link is visible inside the iframe
const courseFrame = page.frameLocator(iframeSelector);
await expect(
  courseFrame.getByRole('link', {
    name: expectedLinkName,
    exact: true,
  })
).toBeVisible();
console.log('Iframe loaded and verified successfully.');


});
