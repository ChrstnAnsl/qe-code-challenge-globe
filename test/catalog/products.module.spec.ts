import { expect, test } from "../fixtures/test-fixture";

test.describe("Catalog module", () => {
  test("shopper can browse the catalog and open a product detail page", async ({
    productsPage,
    productDetailPage,
  }) => {
    // Arrange
    await productsPage.goto();

    // Act
    const names = await productsPage.listedNames();
    await productsPage.openFirstProduct();
    const product = await productDetailPage.readProduct();

    // Assert
    expect(names.length).toBeGreaterThan(0);
    expect(product.name.length).toBeGreaterThan(0);
    expect(product.price).toMatch(/\$\d/);
    await expect(productDetailPage.addToCartButton).toBeEnabled();
  });
});
