import { expect, type FrameLocator, type Locator, type Page } from "@playwright/test";
import { TIMEOUTS } from "@ui/constants";

export type TestCard = {
  number: string;
  expiry: string;
  cvc: string;
  postalCode: string;
};

export class StripePaymentComponent {
  private readonly page: Page;
  private readonly frames: Locator;

  constructor(page: Page) {
    this.page = page;
    this.frames = page.locator('iframe[title="Secure payment input frame"]');
  }

  async fill(card: TestCard): Promise<void> {
    const fillCardForm = async (): Promise<void> => {
      const cardFrame = await this.resolveCardFrame();
      const cardNumber = cardFrame.getByRole("textbox", { name: "Card number" });
      await cardNumber.fill(card.number, { timeout: 10_000 });

      const expiry = cardFrame.getByPlaceholder("MM / YY");
      await expiry.fill(card.expiry, { timeout: 10_000 });

      const cvc = cardFrame.getByRole("textbox", { name: "Security code" });
      await cvc.fill(card.cvc, { timeout: 10_000 });

      const zip = cardFrame.getByRole("textbox", { name: /zip code/i });
      if (await zip.count()) {
        await zip.fill(card.postalCode, { timeout: 10_000 });
      }

      await this.page.waitForTimeout(1_500);
      await expect(cardNumber).toHaveValue(/4242/, { timeout: 2_000 });
      await expect(expiry).toHaveValue(/12/, { timeout: 2_000 });
      await expect(cvc).toHaveValue(card.cvc, { timeout: 2_000 });
    };

    await expect(fillCardForm).toPass({ timeout: TIMEOUTS.stripe });
  }

  private async resolveCardFrame(): Promise<FrameLocator> {
    const frameCount = await this.frames.count();

    for (let index = 0; index < frameCount; index += 1) {
      const frame = this.frames.nth(index).contentFrame();
      if (await frame.getByRole("textbox", { name: "Card number" }).count()) {
        return frame;
      }
    }

    throw new Error("Stripe card form has not rendered yet");
  }
}
