import mongoose, { model, models, Schema } from "mongoose"

const CategorySchema = new Schema({
  image: {type: String},
  name: {type: String, required: true},
  parent: {type:mongoose.Types.ObjectId, ref: 'Category'},
  properties: [{
    name: {type: String},
    values: [{type: String}]
  }],
  order: {type: Number}
});

export const Category = models.Category || model('Category', CategorySchema);