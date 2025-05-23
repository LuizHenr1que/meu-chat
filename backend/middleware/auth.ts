import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Token missing' });
    return;
  }

  jwt.verify(token, 'secreta', (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Invalid token' });
      return;
    }

    req.user = decoded as JwtPayload;
    next();
  });
}