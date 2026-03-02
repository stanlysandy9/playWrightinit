import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Username field locator with multiple fallbacks
    this.usernameField = page.locator('input[name="username"]')
      .or(page.locator('input[id*="username" i]'))
      .or(page.locator('input[placeholder*="username" i]'))
      .or(page.locator('input[placeholder*="email" i]'))
      .or(page.locator('input[type="email"]'))
      .or(page.locator('input[type="text"]').first());
    
    // Password field locator with multiple fallbacks
    this.passwordField = page.locator('input[name="password"]')
      .or(page.locator('input[id*="password" i]'))
      .or(page.locator('input[placeholder*="password" i]'))
      .or(page.locator('input[type="password"]'));
    
    // Login button locator with multiple fallbacks
    this.loginButton = page.locator('button[type="submit"]')
      .or(page.locator('button:has-text("Login")'))
      .or(page.locator('button:has-text("Sign In")'))
      .or(page.locator('button:has-text("Sign in")'))
      .or(page.locator('input[type="submit"]'));
  }

  /**
   * Navigate to the OrangeHRM login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Enter username in the username field
   * @param username - The username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.usernameField.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameField.clear();
    await this.usernameField.type(username, { delay: 50 });
  }

  /**
   * Enter password in the password field
   * @param password - The password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.passwordField.waitFor({ state: 'visible', timeout: 10000 });
    await this.passwordField.clear();
    await this.passwordField.type(password, { delay: 50 });
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.loginButton.click();
  }

  /**
   * Check if login page is loaded
   * @returns True if the page is loaded
   */
  async isLoginPageLoaded(): Promise<boolean> {
    try {
      await this.usernameField.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for navigation to complete after login
   */
  async waitForNavigationAfterLogin(): Promise<void> {
    try {
      await this.page.waitForURL('**/dashboard**', { timeout: 15000 });
    } catch {
      // Dashboard might not load, but check if logout is visible instead
      await this.page.locator('button:has-text("Logout")').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    }
  }

  /**
   * Verify user is successfully logged in
   * @returns True if user is logged in, false otherwise
   */
  async isUserLoggedIn(): Promise<boolean> {
    try {
      // Check if redirected to dashboard
      const isOnDashboard = await this.page.url().includes('/dashboard');
      
      if (isOnDashboard) {
        return true;
      }

      // Alternative: Check for logout button presence
      const logoutButton = this.page.locator('button:has-text("Logout")').or(
        this.page.locator('a:has-text("Logout")')
      );
      
      return await logoutButton.isVisible().catch(() => false);
    } catch {
      return false;
    }
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    try {
      // Click on user name/profile in top right corner
      const userProfile = this.page.locator('[class*="topbar"]').locator('[class*="user"]').or(
        this.page.locator('div[class*="profile"]').first()
      ).or(
        this.page.locator('img[alt*="profile" i]').or(this.page.locator('img[alt*="user" i]'))
      ).or(
        this.page.locator('button:has-text("Admin")').first()
      );
      
      console.log('Clicking on user profile...');
      await userProfile.waitFor({ state: 'visible', timeout: 5000 });
      await userProfile.click();
      
      // Wait for dropdown to appear
      await this.page.waitForTimeout(500);
      
      //TS Click logout option from dropdown
      const logoutOption = this.page.locator('a:has-text("Logout")').or(
        this.page.locator('button:has-text("Logout")').or(
          this.page.locator('[class*="dropdown"] a:has-text("Logout")')
        )
      );
      
      console.log('Clicking logout option...');
      await logoutOption.waitFor({ state: 'visible', timeout: 5000 });
      await logoutOption.click();
      
      // Wait for redirect to login page
      await this.page.waitForURL('**/auth/login**', { timeout: 10000 });
      console.log('✅ Successfully logged out and redirected to login page');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  /**
   * Verify logout was successful
   * @returns True if user is on login page, false otherwise
   */
  async isLogoutSuccessful(): Promise<boolean> {
    try {
      const isOnLoginPage = this.page.url().includes('/auth/login');
      const usernameFieldVisible = await this.isLoginPageLoaded();
      return isOnLoginPage && usernameFieldVisible;
    } catch {
      return false;
    }
  }
}

