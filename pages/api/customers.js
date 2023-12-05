import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const customers = await Customer.find({}).populate('orders.orders').sort({updatedAt: -1});
    res.status(200).json(customers);
  }
}