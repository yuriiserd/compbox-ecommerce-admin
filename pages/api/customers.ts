import { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from "../../lib/mongoose";
import { Customer } from "../../models/Customer";
import { Order } from "../../models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await mongooseConnect();
  if (req.method === 'POST') {
    const {period} = req.body;
    const [fromDate, toDate] = period;
    const customers = await Customer.find({createdAt: {$gte: fromDate, $lte: toDate}}).sort({updatedAt: -1}).populate('orders');
    res.status(200).json(customers);
  }
  if (req.method === 'GET') {
    await Order.find({}).sort({updatedAt: -1});
    const customers = await Customer.find({}).sort({updatedAt: -1}).populate('orders');
    res.status(200).json(customers);
  }
}