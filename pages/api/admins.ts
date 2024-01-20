import { mongooseConnect } from "../../lib/mongoose";
import { Admin } from "../../models/Admin";

export default async function handler(req, res) {
  
  await mongooseConnect();
  
  if (req.method === 'POST') {
    await Admin.create(req.body); 
    res.status(200).json({success: true});
  }

  if (req.method === 'PUT') {
    await Admin.updateOne({_id: req.body._id}, req.body);
    res.status(200).json({success: true});
  }

  if (req.method === 'GET') {
    if (req.query.id) {
      const admin = await Admin.findById(req.query.id);
      res.status(200).json(admin);
    } else if (req.query.email) {
      const admin = await Admin.findOne({email: req.query.email});
      res.status(200).json(admin);
    } else {
      const admins = await Admin.find({}).sort({updatedAt: -1});
      res.status(200).json(admins);
    }
    
  }

  if (req.method === "DELETE") {
    if (req.query?.id) {
      await Admin.deleteOne({_id: req.query.id})
    }
    setTimeout(() => {
      res.json(true)
    }, 10) // just for testing loading gif 
  }
}