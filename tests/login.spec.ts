import { expect } from '@playwright/test';
import { test_with_login } from '../fixtures/loginFixture';

// Parameterized credentials
const TEST_CREDENTIALS = {
  username: 'Admin',
  password: 'admin123',
};

test_with_login.describe('OrangeHRM Login Tests', () => {
  test_with_login('TC_001: User should successfully login with correct credentials', async ({ loginPage }) => {
    // ✅ LOCKED & VERIFIED - Comprehensive login test

    // Step 1: Navigate to OrangeHRM login page (handled by fixture)
    const isPageLoaded = await loginPage.isLoginPageLoaded();
    expect(isPageLoaded).toBeTruthy();
    console.log('✅ Step 1: Login page loaded successfully');

    // Step 2: Use parameterized credentials
    const { username, password } = TEST_CREDENTIALS;
    console.log(`📝 Step 2: Using credentials - Username: ${username}, Password: ${password}`);

    // Step 3: Enter username
    await loginPage.enterUsername(username);
    const enteredUsername = await loginPage.usernameField.inputValue();
    expect(enteredUsername).toBe(username);
    console.log(`✅ Step 3: Username entered successfully - ${enteredUsername}`);

    // Step 4: Enter password
    await loginPage.enterPassword(password);
    const enteredPassword = await loginPage.passwordField.inputValue();
    expect(enteredPassword).toBe(password);
    console.log(`✅ Step 4: Password entered successfully`);

    // Step 5: Click login button
    await loginPage.clickLoginButton();
    console.log('✅ Step 5: Login button clicked');

    // Step 6: Wait for login to complete
    await loginPage.waitForNavigationAfterLogin();
    console.log('✅ Step 6: Waiting for dashboard navigation completed');

    // Step 7: Verify user is successfully logged in
    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
    console.log('✅ Step 7: User successfully verified logged in!');

    // Step 8: Logout if login is successful
    if (isLoggedIn) {
      await loginPage.logout();
      console.log('✅ Step 8: User logout initiated');

      // Verify logout was successful
      const logoutSuccessful = await loginPage.isLogoutSuccessful();
      expect(logoutSuccessful).toBeTruthy();
      console.log('✅ Step 8: Logout confirmed - User successfully redirected back to login page');
    }

    console.log('✅ ✅ ✅ FULL LOGIN & LOGOUT FLOW COMPLETED SUCCESSFULLY! ✅ ✅ ✅');
  });
});
