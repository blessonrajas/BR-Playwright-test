import { expect, Locator, Page } from '@playwright/test';

export interface PaymentDetails {
    creditCardNumber: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
    nameOnCard: string;
    countrySearchText: string;
    countryName: string;
    email: string;
}

export class CheckoutPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async proceedToCheckoutAndFillPaymentDetails(details: PaymentDetails) {
        await this.page.getByRole('button', { name: 'Buy Now' }).click();
        await this.page.locator('.form__cc .field').filter({ hasText: 'Credit Card Number' }).locator('input').fill(details.creditCardNumber);

        const expiryFields: Locator = this.page.locator('.form__cc .field').filter({ hasText: 'Expiry Date' }).locator('select');
        await expiryFields.nth(0).selectOption(details.expiryMonth.toString());
        await expiryFields.nth(1).selectOption(details.expiryYear.toString());

        await this.page.locator('.form__cc .field').filter({ hasText: 'CVV' }).locator('input').fill(details.cvv);
        await this.page.locator('.form__cc .field').filter({ hasText: 'Name on Card' }).locator('input').fill(details.nameOnCard);

        await this.page.getByPlaceholder('Select Country').pressSequentially(details.countrySearchText);
        const countrySuggestion = this.page.locator('button.ta-item').filter({
            has: this.page.getByText(details.countryName, { exact: true }),
        });
        await countrySuggestion.click();
        await expect(this.page.getByText(details.email, { exact: true }).first()).toBeVisible();
    }

    async submitOrder() {
        const orderMessage = this.page.getByText('Order Placed Successfully', { exact: true });

        await Promise.all([
            expect(orderMessage).toBeVisible({ timeout: 5000 }),
            this.page.locator('a.action__submit').click(),
        ]);
    }
}