import { expect, Page } from '@playwright/test';

export class OrderConfirmationPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async getOrderId(productName: string): Promise<string> {
        await expect(this.page.locator('.hero-primary')).toHaveText('Thankyou for the order.');
        const orderId = (await this.page.locator('td.em-spacer-1 > label.ng-star-inserted').innerText())
            .split('|')[1].trim();

        await expect(this.page.locator('div.title').filter({ hasText: productName })).toBeVisible();

        return orderId;
    }
}