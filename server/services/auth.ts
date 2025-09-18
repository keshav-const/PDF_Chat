import { RequestHandler } from "express";
import session from "express-session";
import { config } from "../config";
import { storage } from "../storage";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

export const sessionMiddleware = session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});

export const authMiddleware: RequestHandler = (req, res, next) => {
  sessionMiddleware(req, res, next);
};

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
