import { Schema, model, models } from 'mongoose';

const settingSchema = new Schema({
  name: {type: String, unique: true, required: true},
  value: {type: Object}
});

export const Setting = models?.Setting || model('Setting', settingSchema);
