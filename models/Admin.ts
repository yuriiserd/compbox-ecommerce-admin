const { Schema, models, model } = require("mongoose");

const AdminSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type:String, required: true},
  role: {type: String, required: true},
  photo: {type: String},
  lastLogin: {type: Date}
}, {
  timestamps: true
});

export const Admin = models.Admin || model('Admin', AdminSchema);
