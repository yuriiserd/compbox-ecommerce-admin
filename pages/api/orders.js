import { mongooseConnect } from "@/lib/mongoose";
import { Customer } from "@/models/Customer";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product"

export default async function handler(req, res) {
  const method = req.method;
  await mongooseConnect();
  if (method === "POST") {
    if (req.body.filters) {
      const {paid, status} = req.body.filters;
      const filters = {};
      if (paid !== "All") {
        filters.paid = paid === "Paid" ? true : false;
      }
      if (status !== "All") {
        filters.status = status;
      }
      const orders = await Order.find(filters).sort({createdAt: -1});
      res.json(orders);
      return;
    }
    const {address, city, country, email, product_items, name, zip, status} = req.body;
    const orderDoc = await Order.create({
      address, city, country, email, name, product_items, zip, status
    })
    res.json(orderDoc);
  }
  if (method === "PUT") {

    const {address, city, country, email, name, product_items, zip, status, _id} = req.body;

    const order = await Order.updateOne({_id}, {product_items, address, city, country, email, name, zip, status});
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
      //remove order from customer orders before deleting order
      const order = await Order.findOne({_id: req.query.id});
      const customer = await Customer.findOne({email: order.email});
      if (customer) {
        const customerOrders = customer.orders;
        const newCustomerOrders = customerOrders.filter(order => {
          return order.toString() !== req.query.id;
        });
        await Customer.updateOne({email: order.email}, {orders: newCustomerOrders});
      }
      //deliting order
      await Order.deleteOne({_id: req.query.id});
    }
    res.json(true)
  }
}