import mongoose, { Schema, model, models } from "mongoose"
import "./Category";

const ProductSchema = new Schema({
  title: {type: String, required: true},
  category: {type:mongoose.Types.ObjectId, ref: 'Category'},
  searchQuery: String,
  description: String,
  content: String,
  price: {type: Number, required: true},
  salePrice: {type: Number},
  images: [{type: String}],
  properties: {type: Object},
}, {
  timestamps: true,
});

export const Product = models.Product || model('Product', ProductSchema);