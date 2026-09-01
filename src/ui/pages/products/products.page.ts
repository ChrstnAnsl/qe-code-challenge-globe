import { expect, type Locator, type Page } from "@playwright/test";
import { ROUTES, ROUTE_PATTERNS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";

export class ProductsPage extends BasePage {
  readonly path = ROUTES.products;
  readonly productLinks: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page
      .getByRole("main")
      .getByRole("heading", { level: 3 })
      .getByRole("link");
  }

  async openFirstProduct(): Promise<void> {
    const firstProduct = this.productLinks.first();
    await expect(firstProduct).toBeVisible();

    await expect(async () => {
      if (!ROUTE_PATTERNS.productDetail.test(this.page.url())) {
        await firstProduct.click({ timeout: 5_000 });
      }

      await this.page.waitForURL(ROUTE_PATTERNS.productDetail, { timeout: 5_000 });
    }).toPass({ timeout: 30_000 });
  }

  async listedNames(): Promise<string[]> {
    return (await this.productLinks.allTextContents())
      .map((name) => name.trim())
      .filter(Boolean);
  }
}
