import { Schema, model } from "mongoose";
import type { IUrl } from "../types/index.js";

const urlSchema = new Schema<IUrl>({
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

const UrlModel = model<IUrl>('Url', urlSchema);

export default UrlModel;
