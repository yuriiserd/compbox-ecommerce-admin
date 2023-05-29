const { model, models, Schema } = require("mongoose");

const CategorySchema = new Schema({
  name: {type: String, required: true},
  parent: {type: String}
});

export const Category = models?.Category || model('Category', CategorySchema);