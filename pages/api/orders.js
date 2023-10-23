import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product"

export default async function handler(req, res) {
  const method = req.method;
  await mongooseConnect();
  if (method === "POST") {
    const {address, city, country, email, product_items, name, zip} = req.body;
    const orderDoc = await Order.create({
      address, city, country, email, name, product_items, zip
    })
    res.json(orderDoc);
  }
  if (method === "PUT") {

    const {address, city, country, email, name, product_items, zip, _id} = req.body;

    const order = await Order.updateOne({_id}, {product_items, address, city, country, email, name, zip});
    res.json(order);
  }
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Order.findOne({_id:req.query.id}))
    } else {
      res.json(await Order.find().sort({createdAt: -1}));
    }
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Order.deleteOne({_id: req.query.id})
    }
    res.json(true)
  }
}