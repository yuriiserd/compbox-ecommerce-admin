import { Product } from "../../models/Product";
import { Category } from "../../models/Category"; //load Category model to show Products after server restart
import { mongooseConnect } from "../../lib/mongoose";

export default async function handler(req, res) {
  const {method} = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({_id:req.query.id}).populate('category'))
    } 
    else if (req.query?.search) {
      const search = req.query.search;
      const regex = new RegExp(search,'i'); // make case-insensitive query
      res.json(await Product.find({searchQuery: {$regex: regex}}, null, {sort: {'createdAt': -1}}).populate('category'));
    } 
    else if (req.query?.limit) {
      const limit = parseInt(req.query.limit);
      res.json(await Product.find({}, null, {sort: {'createdAt': -1}}).limit(limit).populate('category'));
    } 
    else if (req.query?.category) {
      const category = req.query.category;
      const childCategories = await Category.find({parent: category});
      const childCategoriesIds = childCategories.map(cat => cat._id);
      res.json(await Product.find({category: {$in: [...childCategoriesIds, category]}}, null, {sort: {'createdAt': -1}}).populate('category'));
      
    } 
    else {
      //TODO add pagination
      res.json(await Product.find({}, null, {sort: {'createdAt': -1}}).limit(20).populate('category'));
    }
  }

  if (method === "POST") {
    const {title, category, description, content, price, salePrice, images, properties} = req.body;
    const categoryName = await Category.findOne({_id: category});
    const productDoc = await Product.create({
      title, 
      category, 
      searchQuery: `${properties.Brand || ''} ${title} ${categoryName.name || ''}`, 
      description, 
      content, price, salePrice, images, properties
    })
    res.json(productDoc);
  }

  if (method === "PUT") {
    const {title, category, description, content, price, salePrice, images, properties, _id} = req.body;
    const categoryName = await Category.findOne({_id: category});
    await Product.updateOne({_id}, {
      title, 
      category, 
      searchQuery: `${properties.Brand || ''} ${title} ${categoryName.name || ''}`, 
      description, 
      content, price, salePrice, images, properties});
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({_id: req.query.id})
    }
    res.json(true)
  }
}
