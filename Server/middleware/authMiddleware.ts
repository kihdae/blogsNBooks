import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "no token provided" });
  }

  try {
    const decoded = await authService.verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ error: "failed to authenticate token" });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ error: "token is expired" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "invalid token" });
    } else {
      console.error("token verification error:", error);
      return res.status(403).json({ error: "failed to authenticate token" });
    }
  }
};

export const authorizeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: "Unauthorized: Admin access required" });
  }
  next();
};