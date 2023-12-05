const { model, models, Schema } = require("mongoose")

const CustomerSchema = new Schema({
  name: {type: String, required: true},
  phone: {type: Number},
  email: {type: String, unique: true, required: true},
  city: {type: String},
  zip: {type: String},
  address: {type: String},
  country: {type: String},
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  likedProducts: [],
}, {timestamps: true});

export const Customer = models?.Customer || model('Customer', CustomerSchema);