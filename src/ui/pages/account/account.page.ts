import { expect, type Locator, type Page } from "@playwright/test";
import { AccountSidebarComponent } from "@ui/components/account-sidebar/account-sidebar.component";
import { HeaderComponent } from "@ui/components/header/header.component";
import { ROUTES, ROUTE_PATTERNS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";
import type { Shopper } from "@ui/types";

export class AccountPage extends BasePage {
  readonly path = ROUTES.account;
  readonly header: HeaderComponent;
  readonly sidebar: AccountSidebarComponent;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpLink: Locator;
  readonly accountOverview: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new AccountSidebarComponent(page);
    this.emailInput = page.getByRole("textbox", { name: /email/i });
    this.passwordInput = page.getByRole("textbox", { name: /password/i });
    this.signInButton = page.getByRole("button", { name: /^sign in$/i });
    this.signUpLink = page.getByRole("link", { name: /sign up/i });
    this.accountOverview = page.getByText(/account overview/i);
  }

  async signOutIfNeeded(): Promise<void> {
    await this.header.openAccount();

    if (await this.sidebar.isVisible()) {
      await this.sidebar.signOut();
      await expect(this.signInButton).toBeVisible();
    }
  }

  async openSignUp(): Promise<void> {
    await expect(this.signUpLink).toBeVisible();
    await this.signUpLink.click();
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.register);
  }

  async signIn(shopper: Shopper): Promise<void> {
    await this.header.openAccount();
    await expect(this.signInButton).toBeVisible();
    await this.emailInput.fill(shopper.email);
    await this.passwordInput.fill(shopper.password);
    await this.signInButton.click();
  }

  async expectSignedIn(shopper: Shopper): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.account);
    await expect(this.accountOverview).toBeVisible();
    await expect(this.page.getByText(shopper.email)).toBeVisible();
  }
}
