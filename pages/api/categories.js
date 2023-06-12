import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Category.findOne({_id: req.query.id}));
    } else {
      res.json(await Category.find());
    }
  }

  if (method === 'POST') {
    const {name, parent} = req.body;
    const categoryDoc = await Category.create({name, parent});
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Category.deleteOne({_id: req.query.id})
    }
    setTimeout(() => {
      res.json(true)
    }, 500) // just for testing loading gif 
  }
}