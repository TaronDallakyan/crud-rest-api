export interface Stock {
  available: number;
  reserved: number;
  location: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Manufacturer {
  name: string;
  address: Address;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: Stock;
  tags: string[];
  rating: number;
  deleted: boolean;
  manufacturer: Manufacturer;
}
