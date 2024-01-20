export type Order = {
  _id?: string;
  name: string;
  email: string;
  city: string;
  zip: string;
  address: string;
  country: string;
  coupon?: {
    amount_off: any;
    created: number;
    currency: any;
    duration: string;
    duration_in_months: number;
    id: string;
    livemode: boolean;
    max_redemptions: any;
    name: string;
    object: string;
    percent_off: number;
    redeem_by: any;
    times_redeemed: number;
    valid: boolean;
  };
  product_items: {
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
  paid: boolean;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
