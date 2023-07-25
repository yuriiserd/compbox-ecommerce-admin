import { Product } from "@/models/Product";
import { Category } from "@/models/Category"; //load Category model to show Products after server restart
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({_id:req.query.id}).populate('category'))
    } else {
      res.json(await Product.find().populate('category'));
    }
  }

  if (method === "POST") {
    const {title, category, description, price, salePrice, images, properties} = req.body;
    const productDoc = await Product.create({
      title, category, description, price, salePrice, images, properties
    })
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {title, category, description, price, salePrice, images, properties, _id} = req.body;
    await Product.updateOne({_id}, {title, category, description, price, salePrice, images, properties});
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({_id: req.query.id})
    }
    res.json(true)
  }
}
