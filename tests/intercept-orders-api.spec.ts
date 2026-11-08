import { test, expect, request, Locator } from '@playwright/test';

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

const APInetworkinterceptionurl: string = 'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/'
const fakepayload: { message: string; count: number; data: never[] } = {
  message: 'No orders found for the customer.',
  count: 0,
  data: [],
};


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


test('Hide orders by intercepting the orders API', async ({ page, request }, testInfo) => {
  await page.goto('https://rahulshettyacademy.com/client/#/dashboard');
  console.log('API login successful');

  // Place an order using the API
  const orderResponse = await request.post(APIorderurl, {
    headers: { Authorization: token! },
    data: orderPayload,
  });
  expect(orderResponse.ok()).toBeTruthy();

  const orderResponseBody: { orders: string[] } = await orderResponse.json();
  const orderID = orderResponseBody.orders[0];
  expect(orderID).toBeTruthy();
  console.log('Order placed successfully with API Order ID:', orderID);

  // The URL ends with the customer ID, so ** matches the rest of the URL.
  await page.route(`${APInetworkinterceptionurl}**`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(fakepayload),
    });
  });

  const ordersResponsePromise = page.waitForResponse(response =>
    response.url().startsWith(APInetworkinterceptionurl),
  );
  await page.getByRole('navigation').getByRole('button', { name: /ORDERS/ }).click();

  // Check that the app received the fake response and does not show the real order.
  const ordersResponse = await ordersResponsePromise;
  expect(ordersResponse.status()).toBe(200);
  expect(await ordersResponse.json()).toEqual(fakepayload);

  const orderRow: Locator = page.getByRole('row').filter({ hasText: orderID! });
  await expect(orderRow).toHaveCount(0);

  // Save a screenshot of the order history page after interception.
  await page.screenshot({ path: testInfo.outputPath('orders-page.png'), fullPage: true });
});


