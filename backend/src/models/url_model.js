import { Schema, model } from "mongoose";

const urlSchema = new Schema({
  longUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  customAlias: {
    type: String,
    default: null,
    sparse: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  guestId: {
    type: String,
    default: null,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UrlModel = model('Url', urlSchema);

export default UrlModel;