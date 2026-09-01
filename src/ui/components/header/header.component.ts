import { expect, type Locator, type Page } from "@playwright/test";
import { ROUTES } from "@ui/constants";

export class HeaderComponent {
  readonly accountLink: Locator;
  readonly openCartButton: Locator;

  private readonly page: Page;
  private readonly openMenuButton: Locator;
  private readonly myAccountLink: Locator;
  private readonly closeSearchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    const chrome = page.getByRole("banner");
    this.accountLink = chrome.getByRole("link", { name: /^account$/i });
    this.openCartButton = chrome.getByRole("button", { name: /open cart/i });
    this.openMenuButton = page.getByRole("button", { name: /open menu/i });
    this.myAccountLink = page.getByRole("link", { name: /my account/i });
    this.closeSearchButton = page.getByRole("button", { name: /close search/i });
  }

  async openAccount(): Promise<void> {
    await expect(async () => {
      if (/\/account/.test(this.page.url())) {
        return;
      }

      if (await this.closeSearchButton.isVisible().catch(() => false)) {
        await this.closeSearchButton.click().catch(() => undefined);
      }

      if (await this.accountLink.isVisible().catch(() => false)) {
        await this.accountLink.click({ timeout: 5_000 });
      } else if (await this.openMenuButton.isVisible().catch(() => false)) {
        await this.openMenuButton.click({ timeout: 5_000 });
        await this.myAccountLink.click({ timeout: 5_000 });
      } else {
        await this.page.goto(ROUTES.account);
      }

      await this.page.waitForURL(/\/account/, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
  }

  async openCart(): Promise<void> {
    await this.openCartButton.click();
  }
}
