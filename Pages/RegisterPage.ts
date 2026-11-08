import type { Page } from '@playwright/test';

export interface RegistrationDetails {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    occupation: string;
    gender: 'Male' | 'Female';
    password: string;
}

export class RegisterPage {
    private readonly page: Page;
    private readonly loginUrl = 'https://rahulshettyacademy.com/client/#/auth/login';

    constructor(page: Page) {
        this.page = page;
    }

    async openRegistrationForm() {
        await this.page.goto(this.loginUrl);
        await this.page.locator('a.text-reset').click();
    }

    async register(details: RegistrationDetails) {
        await this.page.locator('#firstName').fill(details.firstName);
        await this.page.locator('[placeholder="Last Name"]').fill(details.lastName);
        await this.page.locator('[placeholder="email@example.com"]').fill(details.email);
        await this.page.locator('#userMobile').fill(details.mobileNumber);
        await this.page.locator('select[formcontrolname="occupation"]').selectOption({ label: details.occupation });
        await this.page.locator(`input[formcontrolname="gender"][value="${details.gender}"]`).check();
        await this.page.locator('#userPassword').fill(details.password);
        await this.page.locator('#confirmPassword').fill(details.password);
        await this.page.locator('input[type="checkbox"][formcontrolname="required"]').check();
        await this.page.getByRole('button', { name: 'Register', exact: true }).click();
    }
}
