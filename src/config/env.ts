function read(name: string, fallback: string): string {
  return process.env[name]?.trim() || fallback;
}

export const env = {
  baseUrl: read("BASE_URL", "https://demo.spreecommerce.org"),
  country: read("STOREFRONT_COUNTRY", "us"),
  locale: read("STOREFRONT_LOCALE", "en"),
} as const;
