import UserModel from '../models/user_model.js';

class UserDao {
  async createUser(userData) {
    return await UserModel.create(userData);
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email: email.toLowerCase() });
  }

  async findById(userId) {
    return await UserModel.findById(userId).select('-password');
  }

  async findByIdWithPassword(userId) {
    return await UserModel.findById(userId);
  }

  async updateUser(user) {
    return await user.save();
  }
}

export default new UserDao();
