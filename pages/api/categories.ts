import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { parseArgs } from "util";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
    const childrens = [];
    const {name, image, parent, properties} = req.body;
    const categoryDoc = await Category.create({name, image, parent, childrens, properties});

    if (!parent) {
      res.json(categoryDoc);
      return;
    }
    //find parent category and update childrens - add new children 
    const parentCategory = await Category.findOne({_id: parent});
    
    if (parentCategory.childrens.indexOf(categoryDoc._id) === -1) {
      const newChildrens = [...parentCategory.childrens, categoryDoc._id]
      await Category.updateOne({_id:parentCategory._id}, {childrens: newChildrens})
    }

    res.json(categoryDoc);
  }
 
  if (method === 'PUT') {
    if (req.query?.many) {
      const {categories} = req.body;
      const updateOperations = categories.map((category: {_id: string, order: number}) => {
        const {_id, order} = category;
        return {
          updateOne: {
            filter: {_id},
            update: { $set: {order}}
          }
        }
      })
      console.log("-------")
      await Category.bulkWrite(updateOperations);
      res.json(true);
    } else {
      const {name, image, parent, properties, _id} = req.body;
      await Category.updateOne({_id}, {name, image, parent, properties});

      const categoryDoc = await Category.findOne({_id});

      //find parent category and update childrens - add new children 
      if (parent) {
        const parentCategory = await Category.findOne({_id: parent});

        if (parentCategory.childrens.length === 0) {
          const newChildrens = [categoryDoc._id];
          await Category.updateOne({_id:parentCategory._id}, {childrens: newChildrens})
        } else if (parentCategory.childrens.indexOf(categoryDoc._id) === -1) {
          const newChildrens = [...parentCategory.childrens, categoryDoc._id];
          await Category.updateOne({_id:parentCategory._id}, {childrens: newChildrens})
        }
      }

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