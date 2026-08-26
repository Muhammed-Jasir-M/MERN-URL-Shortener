import UserModel from '../models/user_model.js';
import type { IUser } from '../types/index.js';
import type { Types } from 'mongoose';

class UserDao {
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return await UserModel.create(userData);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(userId: string | Types.ObjectId): Promise<IUser | null> {
    return await UserModel.findById(userId).select('-password');
  }

  async findByIdWithPassword(userId: string | Types.ObjectId): Promise<IUser | null> {
    return await UserModel.findById(userId);
  }

  async updateUser(user: IUser): Promise<IUser> {
    return await user.save();
  }
}

export default new UserDao();
