import type { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "@ui/components/header/header.component";
import { ROUTES } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";

export class HomePage extends BasePage {
  readonly path = ROUTES.home;
  readonly header: HeaderComponent;
  readonly heading: Locator;
  readonly shopAllLink: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.heading = page.getByRole("heading", { name: /spree storefront/i });
    this.shopAllLink = page.getByRole("link", { name: /shop all/i });
  }
}
