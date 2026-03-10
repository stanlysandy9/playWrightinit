import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator("id=user-name");
    this.passwordInput = page.locator("id=password");
    this.loginButton = page.locator("id=login-button");
  }
     async openApplication() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  async login(userNameVal: string, passwordVal: string) {
    await this.userNameInput.fill(userNameVal);
    await this.passwordInput.fill(passwordVal);
    await this.loginButton.click();
  }
   
}