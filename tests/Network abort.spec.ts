import { test, expect } from '@playwright/test';

const loginUrl = 'https://rahulshettyacademy.com/api/ecom/auth/login';
const dashboardUrl = 'https://rahulshettyacademy.com/client/#/dashboard';
const ordersApiUrl =
  'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/';

test('Abort the orders API request', async ({ page, request }, testInfo) => {
  // Get a login token so the app can open the orders page.
  const loginResponse = await request.post(loginUrl, {
    data: {
      userEmail: 'loki112233@gmail.com',
      userPassword: '123@Stek',
    },
  });
  expect(loginResponse.ok()).toBeTruthy();
  const { token } = await loginResponse.json();

  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, token);

  // Stop the orders request instead of letting it reach the server.
  await page.route(`${ordersApiUrl}**`, route => route.abort());
  // Open the app's dashboard.
  await page.goto(dashboardUrl);

  const failedRequestPromise = page.waitForEvent('requestfailed', request =>
    request.url().startsWith(ordersApiUrl),
  );
  // Open Order History; this triggers the orders API request.
  await page.getByRole('navigation').getByRole('button', { name: /ORDERS/ }).click();

  // Confirm the orders API request was aborted.
  const failedRequest = await failedRequestPromise;
  expect(failedRequest.failure()).toBeTruthy();

  // Capture the page state after the request is aborted.
  await page.screenshot({
    path: testInfo.outputPath('orders-api-aborted.png'),
    fullPage: true,
  });
});
