
import { test } from '@playwright/test';
import { PageObjectManager, type PaymentDetails } from '../Pages/page-object-manager';


const loginmail: string = 'loki112233@gmail.com'
const loginpassword: string = '123@Stek'
const productName: string = 'ADIDAS ORIGINAL'
const paymentDetails: PaymentDetails = {
  creditCardNumber: '8823 1122 9292 2293',
  expiryMonth: 12,
  expiryYear: 25,
  cvv: '123',
  nameOnCard: 'Loki',
  countrySearchText: 'Ind',
  countryName: 'India',
  email: loginmail,
};


test('End to End Test with Framework', async ({ page }) =>{
const pageObjectManager = new PageObjectManager(page);

// Login to the application
const loginPage = pageObjectManager.getLoginPage();
await loginPage.goto();
await loginPage.validLogin(loginmail, loginpassword);

// add to cart
const cartPage = pageObjectManager.getCartPage();
await cartPage.addToCart(productName);
await cartPage.verifyCart(productName);

// payment screen and checkout
const checkoutPage = pageObjectManager.getCheckoutPage();
await checkoutPage.proceedToCheckoutAndFillPaymentDetails(paymentDetails);
await checkoutPage.submitOrder();

// order confirmation
const orderConfirmationPage = pageObjectManager.getOrderConfirmationPage();
const orderID = await orderConfirmationPage.getOrderId(productName);
console.log('Order ID is: ' + orderID);
console.log("Order confirmation page is displayed successfully with the product name: " + productName);


// order history
const orderHistoryPage = pageObjectManager.getOrderHistoryPage();
await orderHistoryPage.verifyOrderInHistory(productName, orderID);
console.log("Order history page is displayed successfully with the order ID: " + orderID + " and product name: " + productName);

// Test case passed
})
