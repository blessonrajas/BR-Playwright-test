
import { test } from '@playwright/test';
import { POManager, type PaymentDetails } from '../Pages/POManager';


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
const poManager = new POManager(page);

// Login to the application
const loginPage = poManager.getLoginPage();
await loginPage.goto();
await loginPage.validLogin(loginmail, loginpassword);

// add to cart
const cartPage = poManager.getCartPage();
await cartPage.addToCart(productName);
await cartPage.verifyCart(productName);

// payment screen and checkout
const checkoutPage = poManager.getCheckoutPage();
await checkoutPage.proceedToCheckoutAndFillPaymentDetails(paymentDetails);
await checkoutPage.submitOrder();

// order confirmation
const orderConfirmationPage = poManager.getOrderConfirmationPage();
const orderID = await orderConfirmationPage.getOrderId(productName);
console.log('Order ID is: ' + orderID);
console.log("Order confirmation page is displayed successfully with the product name: " + productName);


// order history
const orderHistoryPage = poManager.getOrderHistoryPage();
await orderHistoryPage.verifyOrderInHistory(productName, orderID);
console.log("Order history page is displayed successfully with the order ID: " + orderID + " and product name: " + productName);

// Test case passed
})
