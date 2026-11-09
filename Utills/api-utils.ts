import { expect, request, Page } from '@playwright/test';

export class apiutills {
  readonly page: Page;
  readonly APIloginurl: string;
  readonly loginpayload: { userEmail: string; userPassword: string };
  token!: string;
  orderID!: string;
  readonly orderPayload: { orders: { country: string; productOrderedId: string }[] };
  readonly APIorderurl: string;

  constructor(
    page: Page,
    APIloginurl: string,
    loginpayload: { userEmail: string; userPassword: string },
    orderPayload: { orders: { country: string; productOrderedId: string }[] },
    APIorderurl: string,
  ) {
    this.page = page;
    this.APIloginurl = APIloginurl;
    this.loginpayload = loginpayload;
    this.orderPayload = orderPayload;
    this.APIorderurl = APIorderurl;
  }

  async apilogin(): Promise<string> {
    const apicontext = await request.newContext();

    try {
      const response = await apicontext.post(this.APIloginurl, {data: this.loginpayload,});

      expect(response.ok()).toBeTruthy();
      const responseBody: { token: string } = await response.json();
      this.token = responseBody.token;

      await this.page.addInitScript((value: string) => {
        window.localStorage.setItem('token', value);
      }, this.token);

      return this.token;
    } finally {
      await apicontext.dispose();
    }
  }
 

  async apiorder(): Promise<void> {
    const apicontext = await request.newContext();

    try {
      const orderResponse = await apicontext.post(this.APIorderurl, {
        headers: { Authorization: this.token },
        data: this.orderPayload,
      });
      expect(orderResponse.ok()).toBeTruthy();

      const orderResponseBody: { orders: string[] } = await orderResponse.json();
      this.orderID = orderResponseBody.orders[0];
      expect(this.orderID).toBeTruthy();
    } finally {
      await apicontext.dispose();
    }

  }

}
