import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Custom fixture type for LoginPage
 */
export type LoginPageFixture = {
  loginPage: LoginPage;
};

/**
 * Custom test fixture that extends Playwright's test with LoginPage
 * Automatically initializes LoginPage and navigates to the login page before each test
 */
export const test_with_login = test.extend<LoginPageFixture>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },
});
