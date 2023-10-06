const { model, models, Schema } = require("mongoose")

const OrderSchema = new Schema({
  product_items: Object,
  name: String,
  email: String,
  city: String,
  zip: String,
  address: String,
  country: String,
  paid: Boolean,
}, {
  timestamps: true,
})

export const Order = models?.Order || model('Order', OrderSchema);