import { expect, type Locator, type Page } from "@playwright/test";
import { CartDrawerComponent } from "@ui/components/cart-drawer/cart-drawer.component";
import { HeaderComponent } from "@ui/components/header/header.component";
import { ROUTES, ROUTE_PATTERNS, TIMEOUTS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";

export class ProductDetailPage extends BasePage {
  readonly path = ROUTES.products;
  readonly header: HeaderComponent;
  readonly drawer: CartDrawerComponent;
  readonly heading: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.drawer = new CartDrawerComponent(page);
    this.heading = page.getByRole("main").getByRole("heading").first();
    this.price = page.getByRole("main").getByText(/^\$\d/).first();
    this.addToCartButton = page.getByRole("button", { name: /add to cart/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.productDetail);
    await expect(this.addToCartButton).toBeEnabled({ timeout: TIMEOUTS.default });
  }

  async readProduct(): Promise<{ name: string; price: string }> {
    await this.expectLoaded();
    return {
      name: (await this.heading.innerText()).trim(),
      price: (await this.price.innerText()).trim(),
    };
  }

  async addToCart(): Promise<void> {
    await this.expectLoaded();
    await this.addToCartButton.click();

    await expect(async () => {
      if (!(await this.drawer.viewCartLink.count())) {
        const badge = (await this.header.openCartButton.textContent({ timeout: 3_000 })) ?? "";

        if (/\d/.test(badge)) {
          await this.header.openCartButton.click({ timeout: 3_000 });
        } else {
          await this.addToCartButton.click({ timeout: 3_000 });
        }
      }

      await expect(this.drawer.viewCartLink).toBeVisible({ timeout: 5_000 });
    }).toPass({ timeout: TIMEOUTS.drawer });
  }
}
