import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  active: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  avatar: { type: String },
  activeCode: String,
});
