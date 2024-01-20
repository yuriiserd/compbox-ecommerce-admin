import { mongooseConnect } from "../../lib/mongoose";
import { Setting } from "../../models/Setting";

export default async function handler(req, res) {
  await mongooseConnect();
  
  if (req.method === 'PUT') {
    const { name, value } = req.body;
    const setting = await Setting.findOne({name});
    if (setting) {
      setting.value = value;
      await setting.save();
      res.json(setting);
    } else {
      res.json(await Setting.create({name, value}));
    }
  }
  if (req.method === 'GET') {
    const { name } = req.query;
    const setting = await Setting.findOne({name});
    res.json(setting);
  }

} 