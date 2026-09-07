import { expect, type Locator, type Page } from "@playwright/test";
import { ROUTES, ROUTE_PATTERNS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";

export class CartPage extends BasePage {
  readonly path = ROUTES.cart;
  readonly heading: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly quantityInput: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { name: /shopping cart/i });
    this.itemName = page.getByRole("main").getByRole("heading", { level: 3 }).first();
    this.itemPrice = page.getByRole("main").locator("p").filter({ hasText: /^\$\d/ }).first();
    this.quantityInput = page.getByRole("main").getByRole("textbox", { name: /^quantity$/i });
    this.checkoutButton = page.getByRole("link", { name: /proceed to checkout/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.cart);
    await expect(this.heading).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.expectLoaded();
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.checkout);
  }
}
