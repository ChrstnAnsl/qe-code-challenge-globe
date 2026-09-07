import { TIMEOUTS } from "@ui/constants";
import { expect, test } from "../fixtures/test-fixture";
import {
  selectedShipping,
  uniqueShopper,
  usShippingAddress,
} from "../utility/shopper";

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
    await cartPage.expectLoaded();
    
    await expect(cartPage.itemName).toHaveText(product.name);
    await expect(cartPage.quantityInput).toHaveValue("1");
    await expect(cartPage.itemPrice).toHaveText(product.price);

    await cartPage.proceedToCheckout();
    await checkoutPage.expectLoaded();
    await checkoutPage.fillContactIfNeeded(shopper.email);
    await checkoutPage.fillAddress(address);
    await checkoutPage.shippingOption(selectedShipping.name, selectedShipping.price).check();
    await checkoutPage.payWithDisplayedTestCard();
    const order = await checkoutPage.readPlacedOrder();

    // Assert
    expect(order.number).toMatch(/[A-Z0-9-]+/i);
    expect(order.successMessage).toMatch(/thanks for your order/i);
    await expect(page).toHaveURL(/\/order-placed\//);
    await orderConfirmationPage.expectLoaded();
    await expect(
      orderConfirmationPage.shippingMethodSection.getByText(selectedShipping.name),
    ).toBeVisible();
    await expect(
      orderConfirmationPage.shippingMethodSection.getByText(selectedShipping.price),
    ).toBeVisible();
  });
});
