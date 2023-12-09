const { Schema, model, models } = require("mongoose");

const ReviewScema = new Schema({
  userName: {type: String, required: true},
  rating: {type: Number, required: true},
  comment: {type: String, required: true},
  status: {type: String, default: 'pending'},
  productId: {type: Schema.Types.ObjectId, ref: 'Product'},
}, {  
  timestamps: true,
});

export const Review = models?.Review || model('Review', ReviewScema);