import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../types/express.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_12345';

// Optional auth middleware — attaches user if valid token exists, doesn't throw if guest
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
    } catch (err) {
      console.log('Invalid or expired token, proceeding as guest');
    }
  }

  next();
};

// Required auth middleware — throws 401 if missing/invalid
export const requireAuth = (req: Request, res: Response, next: NextFunction): void | Response => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};
