import { NextApiRequest, NextApiResponse } from "next";
import { mongooseConnect } from "../../lib/mongoose";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.json('should be a POST request');
    return
  }

  const {
    _id,
    name, email, city,
    zip, address, country,
    products
  } = req.body;

  await mongooseConnect();

  const uniqueIds = [];
  for (let key in products) {
    uniqueIds.push(key)
  }

  const productsInfo = await Product.find({_id: uniqueIds});

  let product_items = [];

  for (const productId of uniqueIds) {
    const info = productsInfo.find(product => product._id.toString() === productId);
    
    const quantity = products[productId] || 0;

    if (quantity > 0 && info) {
      product_items.push({
        quantity,
        price_data: {
          currency: 'USD',
          product_data: {
            name: info.title,
            images: info.images,
            id: info._id
          },
          unit_amount: info.salePrice ? info.salePrice * 100 : info.price * 100
        }
      })
    }
  }
  let orderDoc = {_id: null};
  if (_id) {
    orderDoc = await Order.updateOne({_id},{
      product_items, 
      name, 
      email, 
      city, 
      zip, 
      address, 
      country, 
      paid: false,
    },
    {
      upsert: true
    })
  } else {
    orderDoc = await Order.create({
      product_items, 
      name, 
      email, 
      city, 
      zip, 
      address, 
      country, 
      paid: false,
    })
  }
  
  
  const session = await stripe.checkout.sessions.create({
    line_items: product_items,
    mode: 'payment',
    customer_email: email,
    success_url: process.env.NEXT_PUBLIC_FRONTEND_URL + '/cart?success=1',
    cancel_url: process.env.NEXT_PUBLIC_FRONTEND_URL + '/cart?cancel=1',
    metadata: {orderId: _id || orderDoc._id.toString()},
  })
  
  res.json({
    url: session.url,
  });

}