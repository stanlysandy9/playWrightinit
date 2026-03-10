import {expect, test} from "@playwright/test";
import {LoginPage} from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

//(TC_001)Application should allow user to login to Application with valid credentials
 test("Login verification", async ({page})=>{
  const loginPage = new LoginPage(page);
 await loginPage.openApplication();
 await loginPage.login("standard_user", "secret_sauce");
 const homePage = new HomePage (page);
 await expect(homePage.homePageText).toHaveText("Products")
})
