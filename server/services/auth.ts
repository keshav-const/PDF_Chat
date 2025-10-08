// // import { RequestHandler } from "express";
// // import session from "express-session";
// // import { config } from "../config.js";
// // import { storage } from "../storage.js";

// // declare module "express-session" {
// //   interface SessionData {
// //     userId?: string;
// //   }
// // }

// // export const sessionMiddleware = session({
// //   secret: config.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     secure: config.NODE_ENV === "production",
// //     httpOnly: true,
// //     maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
// //   },
// // });

// // export const authMiddleware: RequestHandler = (req, res, next) => {
// //   sessionMiddleware(req, res, next);
// // };

// // export const requireAuth: RequestHandler = (req, res, next) => {
// //   if (!req.session.userId) {
// //     return res.status(401).json({ message: "Authentication required" });
// //   }
// //   next();
// // };


// import session from "express-session";
// import connectPgSimple from "connect-pg-simple";
// import type { NextFunction, Request, Response, RequestHandler } from "express";
// import { config } from "../config.js";
// import { db } from "../db.js"; // Make sure this path is correct

// // This part tells the session to use your database
// const PGStore = connectPgSimple(session);
// const pool = db.query.users.findMany.database.pool; // A trick to get the raw pool from Drizzle

// const store = new PGStore({
//   pool: pool,
//   tableName: "user_sessions", // You can name this table whatever you like
//   createTableIfMissing: true,
// });

// // This is your new, production-ready session middleware
// const sessionMiddleware = session({
//   store: store, // We tell express-session to use our new database store
//   secret: config.SESSION_SECRET!,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: config.NODE_ENV === "production",
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//   },
// });

// // We still export it the same way so the rest of your app doesn't break
// export const authMiddleware: RequestHandler = (req, res, next) => {
//   sessionMiddleware(req, res, next);
// };

// export const requireAuth: RequestHandler = (req, res, next) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
//   next();
// };

// // Also, let's make sure the session declaration is still here
// declare module "express-session" {
//   interface SessionData {
//     userId?: string;
//   }
// }

// import session, { Store } from "express-session";
// import type { RequestHandler } from "express";
// import { config } from "../config.js";
// import { db } from "../db.js";
// import { sessions } from "../../shared/schema.js";
// import { eq } from "drizzle-orm";

// // A custom Drizzle-based session store for express-session
// class DrizzleStore extends Store {
//   get = (sid: string, callback: (err: any, session?: session.SessionData | null) => void) => {
//     db.select()
//       .from(sessions)
//       .where(eq(sessions.sid, sid))
//       .then(([row]) => {
//         if (!row) {
//           return callback(null, null);
//         }
//         callback(null, JSON.parse(row.sess as string));
//       })
//       .catch((err) => callback(err));
//   };

//   set = (sid: string, session: session.SessionData, callback?: (err?: any) => void) => {
//     const expires = session.cookie.expires
//       ? new Date(session.cookie.expires)
//       : new Date(Date.now() + (session.cookie.maxAge || 0));

//     db.insert(sessions)
//       .values({
//         sid: sid,
//         sess: JSON.stringify(session),
//         expire: expires,
//       })
//       .onConflictDoUpdate({ target: sessions.sid, set: { sess: JSON.stringify(session), expire: expires } })
//       .then(() => callback && callback())
//       .catch((err) => callback && callback(err));
//   };

//   destroy = (sid: string, callback?: (err?: any) => void) => {
//     db.delete(sessions)
//       .where(eq(sessions.sid, sid))
//       .then(() => callback && callback())
//       .catch((err) => callback && callback(err));
//   };
// }

// // We still export it the same way so the rest of your app doesn't break
// export const authMiddleware: RequestHandler = session({
//   store: new DrizzleStore(),
//   secret: config.SESSION_SECRET!,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: config.NODE_ENV === "production",
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//   },
// });

// export const requireAuth: RequestHandler = (req, res, next) => {
//   if (!req.session.userId) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
//   next();
// };

// // Also, let's make sure the session declaration is still here
// declare module "express-session" {
//   interface SessionData {
//     userId?: string;
//   }
// }


import session, { Store } from "express-session";
import type { RequestHandler } from "express";
import { config } from "../config.js";
import { db } from "../db.js";
import { sessions } from "../../shared/schema.js";
import { eq } from "drizzle-orm";

// A custom Drizzle-based session store for express-session
class DrizzleStore extends Store {
  get = (sid: string, callback: (err: any, session?: session.SessionData | null) => void) => {
    db.select()
      .from(sessions)
      .where(eq(sessions.sid, sid))
      .then(([row]) => {
        if (!row) {
          return callback(null, null);
        }
        // Only parse if it's a string
        const sessionData =
          typeof row.sess === "string" ? JSON.parse(row.sess) : row.sess;
        callback(null, sessionData);
      })
      .catch((err) => callback(err));
  };

  set = (sid: string, session: session.SessionData, callback?: (err?: any) => void) => {
    const expires = session.cookie.expires
      ? new Date(session.cookie.expires)
      : new Date(Date.now() + (session.cookie.maxAge || 0));

    db.insert(sessions)
      .values({
        sid: sid,
        sess: JSON.stringify(session),
        expire: expires,
      })
      .onConflictDoUpdate({ target: sessions.sid, set: { sess: JSON.stringify(session), expire: expires } })
      .then(() => callback && callback())
      .catch((err) => callback && callback(err));
  };

  destroy = (sid: string, callback?: (err?: any) => void) => {
    db.delete(sessions)
      .where(eq(sessions.sid, sid))
      .then(() => callback && callback())
      .catch((err) => callback && callback(err));
  };
}

export const authMiddleware: RequestHandler = session({
  store: new DrizzleStore(),
  secret: config.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}