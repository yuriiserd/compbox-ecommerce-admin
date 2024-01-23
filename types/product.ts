import { Category } from "./category";

export type Product = {
  _id?: string;
  title?: string;
  category?: string | Category;
  description?: string;
  price?: number;
  salePrice?: number;
  images?: string[];
  properties?: {
    [key: string]: string;
  };
  content?: string;
  updatedAt?: Date;
  searchQuery?: string;
}