export type Review = {
  _id?: string;
  userName: string;
  rating: number;
  comment: string;
  status: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}