import type { Locator, Page } from "@playwright/test";

export class AccountSidebarComponent {
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.signOutButton = page.getByRole("button", { name: /sign out/i });
  }

  async isVisible(): Promise<boolean> {
    return this.signOutButton.isVisible().catch(() => false);
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
  }
}
