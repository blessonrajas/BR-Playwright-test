import { expect, Page, Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addToCart(productName: string) {
        const productCard: Locator = this.page
            .locator('.card-body')
            .filter({ has: this.page.getByText(productName, { exact: true }) });
        await expect(productCard.locator('b')).toHaveText(productName);
        await productCard.getByRole('button', { name: 'Add to Cart' }).click();
    }

    async verifyCart(productName: string) {
        await this.page.getByRole('navigation').getByRole('button', { name: /Cart/ }).click();
        const cartItem: Locator = this.page
            .locator('.cartWrap li')
            .filter({ has: this.page.getByRole('heading', { name: productName, exact: true }) });
        await expect(cartItem.getByRole('heading', { name: productName, exact: true })).toBeVisible();
    }
}