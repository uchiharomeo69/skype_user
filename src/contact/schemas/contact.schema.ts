import { Schema } from 'mongoose';

export const ContactSchema = new Schema({
  userId: { type: String, required: true },
  listFriend: { type: Array, default: [] },
});
