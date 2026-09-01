import { expect, test } from "../fixtures/test-fixture";
import { uniqueShopper } from "../utility/shopper";

test.describe("Auth module", () => {
  test("new shopper can register from the user icon and sign in again", async ({
    homePage,
    accountPage,
    registerPage,
  }) => {
    const shopper = uniqueShopper();

    // Arrange
    await homePage.goto();
    await expect(homePage.heading).toBeVisible();
    await accountPage.signOutIfNeeded();

    // Act
    await homePage.header.openAccount();
    await accountPage.openSignUp();
    await registerPage.submit(shopper);
    await accountPage.expectSignedIn(shopper);
    await accountPage.signOutIfNeeded();
    await accountPage.signIn(shopper);

    // Assert
    await accountPage.expectSignedIn(shopper);
    await expect(accountPage.accountOverview).toBeVisible();
  });
});
