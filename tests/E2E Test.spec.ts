
import { test, expect, Locator } from '@playwright/test';

const url: string = 'https://rahulshettyacademy.com/client/#/auth/login'
const loginmail: string = 'loki112233@gmail.com'
const loginpassword: string = '123@Stek'
const productName: string = 'ADIDAS ORIGINAL'
const nameoncard: string = 'Loki'
const creditcardnumber: string = '8823 9931 9292 2293'
const CVVnumber :number = 123;  
const expiryMonth:number = 12;
const expiryYear:number = 25;
const countryInputstarting :string = 'Ind';
const countryName :string = 'India';


test('End to End Test', async ({ page }) =>{

// Login to the application
await page.goto(url);
await page.locator('[placeholder="email@example.com"]').fill(loginmail);
await page.locator('[placeholder="enter your passsword"]').fill(loginpassword);
await page.getByRole('button', {name: 'Login'}).click();

// add to cart
await page.waitForLoadState('networkidle');
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
await page.locator('a.action__submit').click();
console.log("Order placed successfully");

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

// Test case passed 01
})