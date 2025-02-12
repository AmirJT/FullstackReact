import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

// Extend Express request type to include user property
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']; // Expected: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    return next(); // ✅ Ensures function always returns a value
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};