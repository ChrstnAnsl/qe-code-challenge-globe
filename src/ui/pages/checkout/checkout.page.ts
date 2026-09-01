import { expect, type Locator, type Page } from "@playwright/test";
import { StripePaymentComponent } from "@ui/components/stripe-payment/stripe-payment.component";
import { ROUTE_PATTERNS, ROUTES, TIMEOUTS } from "@ui/constants";
import { BasePage } from "@ui/pages/base.page";
import type { PlacedOrder, ShippingAddress, ShippingOption } from "@ui/types";

export class CheckoutPage extends BasePage {
  readonly path = ROUTES.cart;
  readonly stripe: StripePaymentComponent;
  readonly emailInput: Locator;
  readonly accountEmailNote: Locator;
  readonly countrySelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly stateSelect: Locator;
  readonly shippingHeading: Locator;
  readonly shippingRadios: Locator;
  readonly testCardNote: Locator;
  readonly policyConsent: Locator;
  readonly sameAsShipping: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    super(page);
    this.stripe = new StripePaymentComponent(page);
    this.emailInput = page.getByPlaceholder(/email address/i);
    this.accountEmailNote = page.getByText(/using your account email/i);
    this.countrySelect = page.getByLabel(/country/i);
    this.firstNameInput = page.getByLabel(/first name/i).first();
    this.lastNameInput = page.getByLabel(/last name/i).first();
    this.streetInput = page.getByLabel(/^address$/i).first();
    this.cityInput = page.getByLabel(/city/i).first();
    this.postalCodeInput = page.getByLabel(/zip|postal code/i).first();
    this.phoneInput = page.getByLabel(/phone/i).first();
    this.stateSelect = page.getByLabel(/state|province/i).first();
    this.shippingHeading = page.getByRole("heading", { name: /shipping method/i });
    this.shippingRadios = this.shippingHeading.locator("xpath=..").getByRole("radio");
    this.testCardNote = page.getByText(/test card:/i);
    this.policyConsent = page.getByRole("checkbox", { name: /i agree/i });
    this.sameAsShipping = page.getByRole("checkbox", { name: /same as shipping/i });
    this.payButton = page.getByRole("button", { name: /pay now|place order/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.checkout);
  }

  async fillContactIfNeeded(email?: string): Promise<void> {
    await expect(async () => {
      if (await this.accountEmailNote.isVisible().catch(() => false)) {
        return;
      }

      if (email && (await this.emailInput.count())) {
        await expect(this.emailInput).toHaveCount(1, { timeout: 20_000 });
        await this.emailInput.fill(email);
      }
    }).toPass({ timeout: TIMEOUTS.default });
  }

  async fillAddress(address: ShippingAddress): Promise<void> {
    await this.countrySelect.selectOption({ label: address.country });
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.streetInput.fill(address.street);
    await this.cityInput.fill(address.city);
    await this.postalCodeInput.fill(address.postalCode);
    await this.phoneInput.fill(address.phone);
    await this.stateSelect.selectOption({ label: address.state });
    await this.shippingHeading.click();
  }

  async readShippingOptions(): Promise<ShippingOption[]> {
    await expect(this.shippingRadios.first()).toBeVisible({
      timeout: TIMEOUTS.shippingRates,
    });

    const count = await this.shippingRadios.count();
    const options: ShippingOption[] = [];

    for (let index = 0; index < count; index += 1) {
      const radio = this.shippingRadios.nth(index);
      const label = (
        await radio.evaluate(
          (node) => node.closest("label")?.innerText ?? node.parentElement?.textContent ?? "",
        )
      )
        .replace(/\s+/g, " ")
        .trim();

      options.push({
        name: label.replace(/\$[\d,.]+/g, "").trim() || `Shipping option ${index + 1}`,
        price: label.match(/\$[\d,.]+/)?.[0] ?? "$0.00",
      });
    }

    if (options.length === 0) {
      throw new Error("No shipping methods were offered at checkout");
    }

    return options;
  }

  async selectFirstShippingMethod(): Promise<void> {
    await this.shippingRadios.first().check();
  }

  async payWithDisplayedTestCard(): Promise<void> {
    await expect(this.testCardNote).toBeVisible();
    const digits = (await this.testCardNote.innerText()).replace(/\D/g, "");
    const number = digits.length >= 16 ? digits.slice(0, 16) : "4242424242424242";
    const card = {
      number,
      expiry: "12 / 30",
      cvc: "123",
      postalCode: "10001",
    };

    if (await this.policyConsent.isVisible().catch(() => false)) {
      await this.policyConsent.check();
    }

    await expect(async () => {
      if (ROUTE_PATTERNS.orderPlaced.test(this.page.url())) {
        return;
      }

      await this.stripe.fill(card);
      await this.payButton.click({ timeout: 10_000 });
      await this.page.waitForURL(ROUTE_PATTERNS.orderPlaced, { timeout: 30_000 });
    }).toPass({ timeout: TIMEOUTS.payment, intervals: [1_000] });
  }

  async readPlacedOrder(): Promise<PlacedOrder> {
    const success = this.page.getByText(/thanks for your order/i);
    await expect(this.page).toHaveURL(ROUTE_PATTERNS.orderPlaced);
    await expect(success).toBeVisible();
    const numberText = await this.page.getByText(/order #/i).innerText();

    return {
      number: numberText.replace(/order\s*#/i, "").trim(),
      successMessage: (await success.innerText()).trim(),
    };
  }
}
