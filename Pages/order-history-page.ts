import { expect, Page } from '@playwright/test';

export class OrderHistoryPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async verifyOrderInHistory(productName: string, orderId: string) {
        await this.page.getByRole('navigation').getByRole('button', { name: /ORDERS/ }).click();
        const orderRow = this.page.getByRole('row').filter({
            has: this.page.getByRole('rowheader', { name: orderId, exact: true }),
        });
        await expect(orderRow).toBeVisible();
        await expect(orderRow).toContainText(productName);
        await orderRow.getByRole('button', { name: 'View' }).click();
        await expect(this.page.getByText('Thank you for Shopping With Us', { exact: true })).toBeVisible();
        await expect(this.page.getByText(orderId, { exact: true })).toBeVisible();
    }
}