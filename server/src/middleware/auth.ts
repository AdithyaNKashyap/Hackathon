import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('=== AUTH DEBUG ===');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.log('No auth header found, returning 401');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('Invalid auth header format:', authHeader);
      return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    const token = parts[1];
    console.log('Extracted token:', token);
    console.log('Token length:', token ? token.length : 'null');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      console.log('Decoded token:', decoded);
      console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.userId);
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found, returning 401');
        return res.status(401).json({ message: 'Invalid token.' });
      }

      console.log('Authentication successful, proceeding...');
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      res.status(401).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(401).json({ message: 'Authentication failed.' });
  }
};
