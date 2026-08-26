import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userDao from '../dao/user_dao.js';
import urlDao from '../dao/url_dao.js';
import { AppError } from '../types/index.js';
import type { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../types/index.js';
import type { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

class AuthService {
  generateToken(userId: string | Types.ObjectId, email: string): string {
    return jwt.sign({ id: userId.toString(), email }, JWT_SECRET, { expiresIn: '7d' });
  }

  async register({ name, email, password, guestId }: RegisterDTO) {
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    const existingUser = await userDao.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userDao.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    if (guestId) {
      await urlDao.migrateGuestUrlsToUser(guestId, user._id);
    }

    const token = this.generateToken(user._id, user.email);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async login({ email, password, guestId }: LoginDTO) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await userDao.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    if (guestId) {
      await urlDao.migrateGuestUrlsToUser(guestId, user._id);
    }

    const token = this.generateToken(user._id, user.email);

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async getMe(userId: string) {
    const user = await userDao.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId: string, { name, email, currentPassword, newPassword }: UpdateProfileDTO) {
    const user = await userDao.findByIdWithPassword(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailTaken = await userDao.findByEmail(email);
      if (emailTaken) {
        throw new AppError('This email is already in use by another account', 409);
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) {
      user.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        throw new AppError('Current password is required to set a new password', 400);
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) {
        throw new AppError('Current password is incorrect', 401);
      }
      if (newPassword.length < 6) {
        throw new AppError('New password must be at least 6 characters', 400);
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await userDao.updateUser(user);

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export default new AuthService();
