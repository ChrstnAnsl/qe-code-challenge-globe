# Spree Commerce QE Challenge

By: Christian Ansel Fernandez

Playwright UI automation for [demo.spreecommerce.org](https://demo.spreecommerce.org/). The suite covers the required shopper journey — register, sign in, browse, cart, checkout, and order confirmation — with assertions at each key step.

## Challenge coverage

| Requirement | Where it is covered |
| --- | --- |
| Navigate to the demo store | `HomePage` |
| User icon → Sign up from the account menu (log out if needed) | `HeaderComponent`, `AccountPage`, `RegisterPage` |
| Log in with the new credentials | `AccountPage.signIn()` |
| Browse products and open a PDP | `ProductsPage`, `ProductDetailPage` |
| Add the product to cart | `ProductDetailPage.addToCart()` |
| Verify cart name, quantity, and price | `CartPage.readLine()` |
| Checkout: address, shipping, delivery prices, payment, complete | `CheckoutPage` |
| Test card taken from the checkout page | `CheckoutPage.payWithDisplayedTestCard()` |
| Order confirmation with order number and success message | `OrderConfirmationPage` |
| Assertions at each key step | URL, UI copy, cart line, shipping options, order number |
| CI bonus | `.github/workflows/regression.yml` and `quality.yml` |

## Layout

```text
src/ui/         Page Object Model (locators assigned in constructors)
test/
  auth/         registration.module.spec.ts
  catalog/      products.module.spec.ts
  shopping/     checkout.module.spec.ts + helper
  fixtures/     page objects wired for specs
```

Specs follow **Arrange → Act → Assert**. Locators follow the live [Spree storefront](https://github.com/spree/storefront).

## Setup

```bash
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` if you need to override the demo URL.

```bash
npm run lint
npm run typecheck
npm test
```

## GitHub Actions

- **Quality** — lint and typecheck on every pull request
- **Regression** — Playwright Chromium on pull request, `main`, nightly, and `workflow_dispatch`
