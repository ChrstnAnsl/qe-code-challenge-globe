import { expect } from "../fixtures/test-fixture";
import type { CartLine } from "@ui/types";

export function expectCartMatchesProduct(
  line: CartLine,
  product: { name: string; price: string },
): void {
  expect(line.name).toBe(product.name);
  expect(line.quantity).toBe(1);
  expect(line.price).toMatch(/\$\d/);
  expect(product.price).toMatch(/\$\d/);
}
