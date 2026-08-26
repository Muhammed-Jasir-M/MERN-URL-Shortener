import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userDao from '../dao/user_dao.js';
import urlDao from '../dao/url_dao.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

class AuthService {
  generateToken(userId, email) {
    return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
  }

  async register({ name, email, password, guestId }) {
    if (!name || !email || !password) {
      const err = new Error('Name, email, and password are required');
      err.statusCode = 400;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error('Password must be at least 6 characters');
      err.statusCode = 400;
      throw err;
    }

    const existingUser = await userDao.findByEmail(email);
    if (existingUser) {
      const err = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
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
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async login({ email, password, guestId }) {
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await userDao.findByEmail(email);
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    if (guestId) {
      await urlDao.migrateGuestUrlsToUser(guestId, user._id);
    }

    const token = this.generateToken(user._id, user.email);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async getMe(userId) {
    const user = await userDao.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(userId, { name, email, currentPassword, newPassword }) {
    const user = await userDao.findByIdWithPassword(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailTaken = await userDao.findByEmail(email);
      if (emailTaken) {
        const err = new Error('This email is already in use by another account');
        err.statusCode = 409;
        throw err;
      }
      user.email = email.toLowerCase().trim();
    }

    if (name) {
      user.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        const err = new Error('Current password is required to set a new password');
        err.statusCode = 400;
        throw err;
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        const err = new Error('Current password is incorrect');
        err.statusCode = 401;
        throw err;
      }
      if (newPassword.length < 6) {
        const err = new Error('New password must be at least 6 characters');
        err.statusCode = 400;
        throw err;
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await userDao.updateUser(user);

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

export default new AuthService();
