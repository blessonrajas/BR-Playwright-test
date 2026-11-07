import { Locator, Page } from '@playwright/test';

export class Loginpage {
    readonly page: Page;
    readonly username: Locator;
    readonly password: Locator;
    readonly signinbutton: Locator;
    readonly url: string;

    constructor(page: Page) {
        this.page = page;
        this.username = page.locator('[placeholder="email@example.com"]');
        this.password = page.locator('[placeholder="enter your passsword"]');
        this.signinbutton = page.getByRole('button', { name: 'Login' });
        this.url = 'https://rahulshettyacademy.com/client/#/auth/login';
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async validLogin(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.signinbutton.click();
        await this.page.waitForLoadState('networkidle');
    }
}







