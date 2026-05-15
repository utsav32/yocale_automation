import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly authErrorMessage: Locator;
  readonly loginSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.emailField = page.getByPlaceholder("Enter your email");
    this.passwordField = page.getByPlaceholder("Enter your password");
    this.authErrorMessage = page.getByText(
      "Invalid email or password. Please try again using the valid email and password",
    );
    this.loginSuccessMessage = page.getByText("Successfully logged in!");
  }

  async goto() {
    await this.page.goto("https://yocale-test.staging.com");
  }

  async clickOnLoginBtn() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.clickOnLoginBtn();
    await this.loginSuccessMessage.waitFor({ state: "visible" });
  }
}
