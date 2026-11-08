import { LoginPage } from './Loginpage';
import { CartPage } from './Cartpage';
import { CheckoutPage } from './checkoutpage';
export type { PaymentDetails } from './checkoutpage';
import { RegisterPage } from './RegisterPage';
export type { RegistrationDetails } from './RegisterPage';
import { OrderConfirmationPage } from './Orderconfirmationpage';
import { OrderHistoryPage } from './OrderHistorypage';
import type { Page } from '@playwright/test';

export class POManager {
    private readonly loginPage: LoginPage;
    private readonly cartPage: CartPage;
    private readonly checkoutPage: CheckoutPage;
    private readonly registerPage: RegisterPage;
    private readonly orderConfirmationPage: OrderConfirmationPage;
    private readonly orderHistoryPage: OrderHistoryPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
        this.registerPage = new RegisterPage(page);
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

    getRegisterPage(): RegisterPage {
        return this.registerPage;
    }

    getOrderConfirmationPage(): OrderConfirmationPage {
        return this.orderConfirmationPage;
    }

    getOrderHistoryPage(): OrderHistoryPage {
        return this.orderHistoryPage;
    }
}
