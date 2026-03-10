import { Locator, Page } from "@playwright/test";

export class HomePage{

readonly page: Page;
readonly homePageText: Locator;

constructor (page : Page){
    this.page = page;
    this.homePageText = page.getByText("Products");


}



}