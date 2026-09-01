import type { ShippingAddress, Shopper } from "@ui/types";

export function uniqueShopper(): Shopper {
  const stamp = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;

  return {
    firstName: "Ada",
    lastName: "Lovelace",
    email: `qe.ada.${stamp}@example.com`,
    password: "Password123!",
  };
}

export function usShippingAddress(shopper: Shopper): ShippingAddress {
  return {
    firstName: shopper.firstName,
    lastName: shopper.lastName,
    street: "123 Test Street",
    city: "New York",
    country: "United States",
    state: "New York",
    postalCode: "10001",
    phone: "5555550100",
  };
}
