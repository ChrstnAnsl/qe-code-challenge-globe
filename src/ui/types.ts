export type Shopper = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
};

export type ShippingOption = {
  name: string;
  price: string;
};

export type PlacedOrder = {
  number: string;
  successMessage: string;
};
