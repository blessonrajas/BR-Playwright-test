import { test as Base, type Page } from '@playwright/test'
import {apiutills} from '../Utills/api-utils'


const loginPayload: { userEmail: string; userPassword: string ; url : string} = {
	userEmail: 'loki112233@gmail.com',
	userPassword: '123@Stek',
    url: 'https://rahulshettyacademy.com/client/#/auth/login'
}


const apiLoginUrl = 'https://rahulshettyacademy.com/api/ecom/auth/login';
const apiOrderUrl = 'https://rahulshettyacademy.com/api/ecom/order/create-order';

const dataset = {
  country: 'Italy',
  welcomeMessage: 'Welcome',
  productName : 'iphone 13 pro'
};

const orderPayload: { orders: { country: string; productOrderedId: string }[]} = {
  orders: [
    {
      country: dataset.country,
      productOrderedId: '6960ea76c941646b7a8b3dd5',
    },
  ],
};

export const customtest = Base.extend<{
  loginpage: Page;
  creatorder: string;
  dataset: typeof dataset;
}>({

loginpage: async ({ page }, use) => {

await page.goto(loginPayload.url);
await page.locator('[placeholder="email@example.com"]').fill(loginPayload.userEmail);
await page.locator('[placeholder="enter your passsword"]').fill(loginPayload.userPassword);
await page.getByRole('button', {name: 'Login'}).click();
await page.waitForLoadState('networkidle');
await use(page);
await page.close();
},


creatorder: async ({ loginpage }, use) => {
   const apiUtils = new apiutills(
    loginpage,
    apiLoginUrl,
    loginPayload,
    orderPayload,
    apiOrderUrl,
  );
  apiUtils.token = await loginpage.evaluate(() => window.localStorage.getItem('token') || ''); 
  // Reuse the token stored by loginpage; apiorder sends it in the Authorization header.
  await apiUtils.apiorder();
  await use(apiUtils.orderID);
},

dataset: async ({}, use) => {
  await use(dataset);


},
});

