import { test, expect } from '@playwright/test';
import { apiutills } from '../Utills/api-utils';
import { PageObjectManager } from '../Pages/page-object-manager';

const apiLoginUrl = 'https://rahulshettyacademy.com/api/ecom/auth/login';
const loginPayload = {
  userEmail: 'loki112233@gmail.com',
  userPassword: '123@Stek',
};

const apiOrderUrl = 'https://rahulshettyacademy.com/api/ecom/order/create-order';
const orderPayload = {
  orders: [
    {
      country: 'London',
      productOrderedId: '6960ea76c941646b7a8b3dd5',
    },
  ],
};

const productName = 'iphone 13 pro';

test('API with utills', async ({ page }) => {
  const apiutil = new apiutills(page, apiLoginUrl, loginPayload, orderPayload, apiOrderUrl);
  await apiutil.apilogin();

  await page.goto('https://rahulshettyacademy.com/client/#/dashboard');
  console.log('API login successful');

  await apiutil.apiorder();
  const orderID = apiutil.orderID;

  console.log('Order placed successfully with API Order ID:', orderID);

  // Order history validation in UI.
  const pageObjectManager = new PageObjectManager(page);
  const orderHistoryPage = pageObjectManager.getOrderHistoryPage();
  await orderHistoryPage.verifyOrderInHistory(productName, orderID);
  console.log(
    `Order history page is displayed successfully with the order ID: ${orderID} and product name: ${productName}`,
  );
});