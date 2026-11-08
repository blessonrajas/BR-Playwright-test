import { LoginPage } from './Loginpage';
import { CartPage } from './Cartpage';
import { CheckoutPage } from './checkoutpage';
export type { PaymentDetails } from './checkoutpage';
import { OrderConfirmationPage } from './Orderconfirmationpage';
import { OrderHistoryPage } from './OrderHistorypage';
import type { Page } from '@playwright/test';


export class POManager {
    private readonly loginPage: LoginPage;
    private readonly cartPage: CartPage;
    private readonly checkoutPage: CheckoutPage;
    private readonly orderConfirmationPage: OrderConfirmationPage;
    private readonly orderHistoryPage: OrderHistoryPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.orderConfirmationPage = new OrderConfirmationPage(page);
        this.orderHistoryPage = new OrderHistoryPage(page);
    }

    getLoginPage(): LoginPage {
        return this.loginPage;
    }

    getCartPage(): CartPage {
        return this.cartPage;
    }

    getCheckoutPage(): CheckoutPage {
        return this.checkoutPage;
    }

    getOrderConfirmationPage(): OrderConfirmationPage {
        return this.orderConfirmationPage;
    }

    getOrderHistoryPage(): OrderHistoryPage {
        return this.orderHistoryPage;
    }
}
