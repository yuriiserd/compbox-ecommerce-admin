import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Category.findOne({_id:req.query.id}))
    } else {
      res.json(await Category.find().populate('parent'));
    }
  }

  if (method === 'POST') {
    const {name, parent, properties} = req.body;
    const categoryDoc = await Category.create({name, parent, properties});
    res.json(categoryDoc);
  }
 
  if (method === 'PUT') {
    if (req.query?.many) {
      const categories = req.body;
      categories.forEach(async (category) => {
        const {name, parent, properties, _id, order} = category;
        await Category.updateOne({_id}, {name, parent, properties, order})
       })
      res.json(true);
    } else {
      const {name, parent, properties, _id} = req.body;
      await Category.updateOne({_id}, {name, parent, properties})
      res.json(true);
    }
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Category.deleteOne({_id: req.query.id})
    }
    setTimeout(() => {
      res.json(true)
    }, 10) // just for testing loading gif 
  }
}