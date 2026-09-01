import { expect, type Locator, type Page } from "@playwright/test";
import { ROUTES, ROUTE_PATTERNS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";
import type { Shopper } from "@ui/types";

export class RegisterPage extends BasePage {
  readonly path = ROUTES.register;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly policyConsent: Locator;
  readonly createAccountButton: Locator;
  readonly signUpDescription: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByLabel(/first name/i);
    this.lastNameInput = page.getByLabel(/last name/i);
    this.emailInput = page.getByRole("textbox", { name: /email/i });
    this.passwordInput = page.getByRole("textbox", { name: /^password/i });
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.policyConsent = page.getByRole("checkbox", { name: /i agree/i });
    this.createAccountButton = page.getByRole("button", { name: /create account/i });
    this.signUpDescription = page.getByText(/sign up to start shopping/i);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.register);
    await expect(this.createAccountButton).toBeVisible();
    await expect(this.signUpDescription).toBeVisible();
  }

  async submit(shopper: Shopper): Promise<void> {
    await this.expectLoaded();
    await this.firstNameInput.fill(shopper.firstName);
    await this.lastNameInput.fill(shopper.lastName);
    await this.emailInput.fill(shopper.email);
    await this.passwordInput.fill(shopper.password);
    await this.confirmPasswordInput.fill(shopper.password);
    await this.policyConsent.check();
    await this.createAccountButton.click();
  }
}
