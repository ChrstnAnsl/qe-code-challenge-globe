import type { Locator, Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  abstract readonly path: string;

  async goto(): Promise<void> {
    await this.page.goto(this.path);
    await this.waitForReady();
  }

  protected async waitForReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    const closeSearch = this.page.getByRole("button", { name: /close search/i });
    if (await closeSearch.isVisible().catch(() => false)) {
      await closeSearch.click().catch(() => undefined);
    }
  }

  protected byRole(
    role: Parameters<Page["getByRole"]>[0],
    options?: Parameters<Page["getByRole"]>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }

  protected byText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }
}
