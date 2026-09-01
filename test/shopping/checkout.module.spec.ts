import { TIMEOUTS } from "@ui/constants";
import { expect, test } from "../fixtures/test-fixture";
import { uniqueShopper, usShippingAddress } from "../utility/shopper";
import { expectCartMatchesProduct } from "./checkout.module.spec.helpers";

test.describe("Shopping module", () => {
  test("registered shopper can browse, cart, and complete checkout", async ({
    page,
    homePage,
    accountPage,
    registerPage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
    orderConfirmationPage,
  }) => {
    test.setTimeout(TIMEOUTS.journey);
    const shopper = uniqueShopper();
    const address = usShippingAddress(shopper);

    // Arrange
    await homePage.goto();
    await expect(homePage.heading).toBeVisible();
    await accountPage.signOutIfNeeded();
    await homePage.header.openAccount();
    await accountPage.openSignUp();
    await registerPage.submit(shopper);
    await accountPage.expectSignedIn(shopper);
    await accountPage.signOutIfNeeded();
    await accountPage.signIn(shopper);
    await accountPage.expectSignedIn(shopper);

    // Act
    await productsPage.goto();
    await productsPage.openFirstProduct();
    const product = await productDetailPage.readProduct();
    await productDetailPage.addToCart();
    await productDetailPage.drawer.goToCart();
    const cartLine = await cartPage.readLine();
    await cartPage.proceedToCheckout();
    await checkoutPage.expectLoaded();
    await checkoutPage.fillContactIfNeeded(shopper.email);
    await checkoutPage.fillAddress(address);
    const shippingOptions = await checkoutPage.readShippingOptions();
    await checkoutPage.selectFirstShippingMethod();
    await checkoutPage.payWithDisplayedTestCard();
    const order = await checkoutPage.readPlacedOrder();

    // Assert
    expectCartMatchesProduct(cartLine, product);
    expect(shippingOptions.length).toBeGreaterThan(0);
    for (const option of shippingOptions) {
      expect(option.name.length).toBeGreaterThan(0);
      expect(option.price).toMatch(/\$/);
    }
    expect(order.number).toMatch(/[A-Z0-9-]+/i);
    expect(order.successMessage).toMatch(/thanks for your order/i);
    await expect(page).toHaveURL(/\/order-placed\//);
    await orderConfirmationPage.expectLoaded();
  });
});
