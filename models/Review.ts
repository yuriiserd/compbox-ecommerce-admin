import mongoose, { Schema, model, models } from "mongoose"
import "./Product";

const ReviewScema = new Schema({
  userName: {type: String, required: true},
  rating: {type: Number, required: true},
  comment: {type: String, required: true},
  status: {type: String, default: 'pending'},
  productId: {type:mongoose.Types.ObjectId, ref: 'Product'},
}, {  
  timestamps: true,
});

export const Review = models?.Review || model('Review', ReviewScema);