import { Coupon } from "./coupon";

export type Order = {
  _id?: string;
  name?: string;
  email?: string;
  city?: string;
  zip?: string;
  address?: string;
  country?: string;
  coupon?: Coupon;
  product_items?: {
    quantity: number;
    price_data: {
      currency: string;
      product_data: {
        name: string;
        images: string[];
        id: string;
      };
      unit_amount: number;
    };
  }[];
  paid?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}
