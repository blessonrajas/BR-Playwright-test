
import { test } from '@playwright/test';
import { Loginpage } from '../Pages/Loginpage';
import { CartPage } from '../Pages/Cartpage';
import { CheckoutPage, type PaymentDetails } from '../Pages/checkoutpage';
import { OrderConfirmationPage } from '../Pages/Orderconfirmationpage';
import { OrderHistoryPage } from '../Pages/OrderHistorypage';


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

// Login to the application
const loginPage = new Loginpage(page);
await loginPage.goto();
await loginPage.validLogin(loginmail, loginpassword);

// add to cart
const cartPage = new CartPage(page);
await cartPage.addToCart(productName);
await cartPage.verifyCart(productName);

// payment screen and checkout
const checkoutPage = new CheckoutPage(page);
await checkoutPage.proceedToCheckoutAndFillPaymentDetails(paymentDetails);
await checkoutPage.submitOrder();

// order confirmation
const orderConfirmationPage = new OrderConfirmationPage(page);
const orderID = await orderConfirmationPage.getOrderId(productName);
console.log('Order ID is: ' + orderID);
console.log("Order confirmation page is displayed successfully with the product name: " + productName);


// order history
const orderHistoryPage = new OrderHistoryPage(page);
await orderHistoryPage.verifyOrderInHistory(productName, orderID);
console.log("Order history page is displayed successfully with the order ID: " + orderID + " and product name: " + productName);

// Test case passed
})
