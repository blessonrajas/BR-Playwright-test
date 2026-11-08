import { CartPage } from './cart-page';
import { CheckoutPage } from './checkout-page';
import { LoginPage } from './login-page';
import { OrderConfirmationPage } from './order-confirmation-page';
import { OrderHistoryPage } from './order-history-page';
import { RegisterPage } from './register-page';
import type { Page } from '@playwright/test';

export type { PaymentDetails } from './checkout-page';
export type { RegistrationDetails } from './register-page';

export class PageObjectManager {
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
