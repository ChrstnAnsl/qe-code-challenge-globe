import { env } from "@config/env";

export const LOCALE_PREFIX = `/${env.country}/${env.locale}`;

export const ROUTES = {
  home: LOCALE_PREFIX,
  products: `${LOCALE_PREFIX}/products`,
  account: `${LOCALE_PREFIX}/account`,
  register: `${LOCALE_PREFIX}/account/register`,
  cart: `${LOCALE_PREFIX}/cart`,
} as const;

export const ROUTE_PATTERNS = {
  home: new RegExp(`${LOCALE_PREFIX}/?$`),
  products: /\/products\/?$/,
  productDetail: /\/products\/[^/]+/,
  account: /\/account\/?$/,
  register: /\/account\/register/,
  cart: /\/cart/,
  checkout: /\/checkout\//,
  orderPlaced: /\/order-placed\//,
} as const;

export const TIMEOUTS = {
  short: 5_000,
  default: 15_000,
  navigation: 30_000,
  drawer: 45_000,
  shippingRates: 30_000,
  stripe: 60_000,
  payment: 150_000,
  journey: 300_000,
} as const;
