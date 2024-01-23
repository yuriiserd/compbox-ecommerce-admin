import { NextApiRequest, NextApiResponse } from "next";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const coupons = await stripe.coupons.list();
    res.json(coupons.data);
  }
  if (req.method === 'DELETE') {
    const coupon = req.query.id;
    try {
      await stripe.coupons.del(coupon);
      res.json(true);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
  if (req.method === 'POST') {
    try {
      const { name, percent_off, duration_in_months } = req.body;
        if (duration_in_months) {
          await stripe.coupons.create({
            name,
            percent_off,
            duration: "repeating",
            duration_in_months,
          });
        } else {
          await stripe.coupons.create({
            name,
            percent_off,
            duration: "forever",
          });
        }
      res.json(true);
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}