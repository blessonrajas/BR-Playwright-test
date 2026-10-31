
import {test, expect, request} from '@playwright/test';

const APIloginurl: string = 'https://rahulshettyacademy.com/api/ecom/auth/login'
const payload: { userEmail: string; userPassword: string } = {
  userEmail: 'loki112233@gmail.com',
  userPassword: '123@Stek',
}
let token: string |undefined;  

const APIorderurl: string = 'https://rahulshettyacademy.com/api/ecom/order/create-order'
const orderPayload: { orders: { country: string; productOrderedId: string }[]} = {
  orders: [
    {
      country: 'Australia',
      productOrderedId: '6960ea76c941646b7a8b3dd5',
    },
  ],
};
let orderID: string | undefined;

const productName: string = 'iphone 13 pro'


test.beforeAll(async () => {
  const apicontext = await request.newContext();
  const response = await apicontext.post(APIloginurl, { data: payload });

  expect(response.ok()).toBeTruthy();
  const responseBody = await response.json();
  token = responseBody.token;
  console.log("Token generated successfully");

  await apicontext.dispose();
})


test.beforeEach(async ({ page }) => {
  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);
  // Navigate to the dashboard page after setting the token in local storage
});



test('API login test', async ({ page, request }) => {
  await page.goto('https://rahulshettyacademy.com/client/#/dashboard');
  console.log('API login successful');

  // Place an order using the API
  const orderResponse = await request.post(APIorderurl, {
    headers: { Authorization: token! },
    data: orderPayload,
  });
  expect(orderResponse.ok()).toBeTruthy();

  const orderResponseBody: { orders: string[] } = await orderResponse.json();
  orderID = orderResponseBody.orders[0];
  expect(orderID).toBeTruthy();

  console.log('Order placed successfully with API Order ID:', orderID);

// Order History validation in UI

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