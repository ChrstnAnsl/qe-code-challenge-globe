import { expect, type Locator, type Page } from "@playwright/test";
import { ROUTES, ROUTE_PATTERNS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";

export class OrderConfirmationPage extends BasePage {
  readonly path = ROUTES.home;
  readonly successHeading: Locator;
  readonly orderNumber: Locator;
  readonly shippingMethodSection: Locator;

  constructor(page: Page) {
    super(page);
    this.successHeading = page.getByText(/thanks for your order/i);
    this.orderNumber = page.getByText(/order #/i);
    this.shippingMethodSection = page
      .getByRole("heading", { name: /shipping method/i })
      .locator("xpath=..");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.orderPlaced);
    await expect(this.successHeading).toBeVisible();
    await expect(this.orderNumber).toBeVisible();
  }
}
