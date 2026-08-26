import { Document, Types } from 'mongoose';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
}

export interface IUrl extends Document {
  _id: Types.ObjectId;
  longUrl: string;
  shortCode: string;
  customAlias?: string | null;
  userId?: Types.ObjectId | null;
  guestId?: string | null;
  clicks: number;
  createdAt: Date;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  guestId?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  guestId?: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ShortenUrlDTO {
  longUrl: string;
  customAlias?: string;
  userId?: string | null;
  guestId?: string | null;
}

export interface UserContext {
  userId?: string | null;
  guestId?: string | null;
}
