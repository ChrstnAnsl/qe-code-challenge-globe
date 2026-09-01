import { expect, type Locator, type Page } from "@playwright/test";
import { TIMEOUTS } from "@ui/constants";

export class CartDrawerComponent {
  readonly dialog: Locator;
  readonly viewCartLink: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole("dialog");
    this.viewCartLink = this.dialog.getByRole("link", { name: /view cart/i });
    this.checkoutLink = this.dialog.getByRole("link", { name: /^checkout$/i });
  }

  async waitUntilOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: TIMEOUTS.drawer });
  }

  async goToCart(): Promise<void> {
    await this.waitUntilOpen();
    await this.viewCartLink.click();
  }
}
