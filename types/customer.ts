import { Order } from "./order";
import { Product } from "./product";

export type Customer = {
  _id?: string;
  name: string;
  email: string;
  orders: string[] | Order[];
  address: string;
  city: string;
  country: string;
  phone: number;
  zip: string;
  likedProducts: string[] | Product[];
  updatedAt: Date;
  image: string;
  createdAt: Date;
}