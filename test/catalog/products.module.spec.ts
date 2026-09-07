import { expect, test } from "../fixtures/test-fixture";

test.describe("Catalog module", () => {
  test("shopper can browse the catalog and open a product detail page", async ({
    productsPage,
    productDetailPage,
    cartPage,
  }) => {
    // Arrange
    await productsPage.goto();

    // Act
    await productsPage.openFirstProduct();
    const product = await productDetailPage.readProduct();
    await expect(productDetailPage.addToCartButton).toBeEnabled();
    await productDetailPage.addToCart();
    await productDetailPage.drawer.goToCart();

    // Assert
    await cartPage.expectLoaded();
    await expect(cartPage.itemName).toHaveText(product.name);
    await expect(cartPage.quantityInput).toHaveValue("1");
    await expect(cartPage.itemPrice).toHaveText(product.price);
  });
});
