
import { test, expect, Locator } from '@playwright/test';
import { Loginpage } from '../Pages/Loginpage';

const loginmail: string = 'loki112233@gmail.com'
const loginpassword: string = '123@Stek'
const productName: string = 'ADIDAS ORIGINAL'
const nameoncard: string = 'Loki'
const creditcardnumber: string = '8823 1122 9292 2293'
const CVVnumber :number = 123;  
const expiryMonth:number = 12;
const expiryYear:number = 25;
const countryInputstarting :string = 'Ind';
const countryName :string = 'India';


test('End to End Test with Framework', async ({ page }) =>{

// Login to the application
const loginPage = new Loginpage(page);
await loginPage.goto();
await loginPage.validLogin(loginmail, loginpassword);

// add to cart
const productCard: Locator = page.locator('.card-body').filter({ has: page.getByText(productName, { exact: true }) });
await expect(productCard.locator('b')).toHaveText(productName);
await productCard.getByRole('button', {name: 'Add to Cart'}).click();

await page.getByRole('navigation').getByRole('button', { name: /Cart/ }).click();
const cartItem: Locator  = page.locator('.cartWrap li').filter({has: page.getByRole('heading', { name: productName, exact: true })});
await expect(cartItem.getByRole('heading', { name: productName, exact: true })).toBeVisible();


// payment screen and checkout
await page.getByRole('button', {name: 'Buy Now'}).click();
await page.locator('.form__cc .field').filter({ hasText: 'Credit Card Number' }).locator('input').fill(creditcardnumber);
const expiryFields: Locator  = page.locator('.form__cc .field').filter({ hasText: 'Expiry Date' }).locator('select');
await expiryFields.nth(0).selectOption(expiryMonth.toString());
await expiryFields.nth(1).selectOption(expiryYear.toString());
await page.locator('.form__cc .field').filter({ hasText: 'CVV' }).locator('input').fill(CVVnumber.toString());
await page.locator('.form__cc .field').filter({ hasText: 'Name on Card' }).locator('input').fill(nameoncard);
await page.getByPlaceholder('Select Country').pressSequentially(countryInputstarting);
const countrySuggestion = page.locator('button.ta-item').filter({
  has: page.getByText(countryName, { exact: true }),
});
await countrySuggestion.click();
await expect(page.getByText(loginmail, { exact: true }).first()).toBeVisible();
const ordermessageverification  = page.getByText('Order Placed Successfully', { exact: true });

await Promise.all([
  expect(ordermessageverification).toBeVisible({ timeout: 5000 }),
  page.locator('a.action__submit').click(),
]);

// order confirmation
await expect(page.locator('.hero-primary')).toHaveText('Thankyou for the order.');
const orderID = (await page.locator('td.em-spacer-1 > label.ng-star-inserted').innerText()).split('|')[1].trim();
console.log("Order ID is: " + orderID);

await expect(page.locator('div.title').filter({ hasText: productName })).toBeVisible();
console.log("Order confirmation page is displayed successfully with the product name: " + productName);


// order history
await page.getByRole('navigation').getByRole('button', { name: /ORDERS/ }).click();
const orderRow = page.getByRole('row').filter({
  has: page.getByRole('rowheader', { name: orderID, exact: true }),
});
await expect(orderRow).toBeVisible();
await expect(orderRow).toContainText(productName);
await orderRow.getByRole('button', { name: 'View' }).click();
await expect(page.getByText('Thank you for Shopping With Us', { exact: true })).toBeVisible();
await expect(page.getByText(orderID, { exact: true })).toBeVisible();
console.log("Order history page is displayed successfully with the order ID: " + orderID + " and product name: " + productName);

// Test case passed
})

