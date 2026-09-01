import { test as base } from "@playwright/test";
import { AccountPage } from "@ui/pages/account/account.page";
import { CartPage } from "@ui/pages/cart/cart.page";
import { CheckoutPage } from "@ui/pages/checkout/checkout.page";
import { HomePage } from "@ui/pages/home/home.page";
import { OrderConfirmationPage } from "@ui/pages/order-confirmation/order-confirmation.page";
import { ProductDetailPage } from "@ui/pages/product-detail/product-detail.page";
import { ProductsPage } from "@ui/pages/products/products.page";
import { RegisterPage } from "@ui/pages/register/register.page";

export type StorefrontFixtures = {
  homePage: HomePage;
  accountPage: AccountPage;
  registerPage: RegisterPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
};

export const test = base.extend<StorefrontFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },
});

export { expect } from "@playwright/test";
