// Environment variables are now loaded in config.ts

// // // // Import config first to ensure environment variables are loaded
// // // import { config } from "./config";

// // // import express, { type Request, Response, NextFunction } from "express";
// // // import { registerRoutes } from "./routes";
// // // import { setupVite, serveStatic, log } from "./vite";

// // // const app = express();
// // // app.use(express.json());
// // // app.use(express.urlencoded({ extended: false }));

// // // app.use((req, res, next) => {
// // //   const start = Date.now();
// // //   const path = req.path;
// // //   let capturedJsonResponse: Record<string, any> | undefined = undefined;

// // //   const originalResJson = res.json;
// // //   res.json = function (bodyJson, ...args) {
// // //     capturedJsonResponse = bodyJson;
// // //     return originalResJson.apply(res, [bodyJson, ...args]);
// // //   };

// // //   res.on("finish", () => {
// // //     const duration = Date.now() - start;
// // //     if (path.startsWith("/api")) {
// // //       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
// // //       if (capturedJsonResponse) {
// // //         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
// // //       }

// // //       if (logLine.length > 80) {
// // //         logLine = logLine.slice(0, 79) + "…";
// // //       }

// // //       log(logLine);
// // //     }
// // //   });

// // //   next();
// // // });

// // // (async () => {
// // //   const server = await registerRoutes(app);

// // //   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
// // //     const status = err.status || err.statusCode || 500;
// // //     const message = err.message || "Internal Server Error";

// // //     res.status(status).json({ message });
// // //     throw err;
// // //   });

// // //   // importantly only setup vite in development and after
// // //   // setting up all the other routes so the catch-all route
// // //   // doesn't interfere with the other routes
// // //   if (app.get("env") === "development") {
// // //     await setupVite(app, server);
// // //   } else {
// // //     serveStatic(app);
// // //   }

// // //   // ALWAYS serve the app on the port specified in the environment variable PORT
// // //   // Other ports are firewalled. Default to 5000 if not specified.
// // //   // this serves both the API and the client.
// // //   // It is the only port that is not firewalled.
// // //   const port = config.PORT;
// // //   server.listen({
// // //     port,
// // //     host: "0.0.0.0",
// // //     reusePort: true,
// // //   }, () => {
// // //     log(`serving on port ${port}`);
// // //   });
// // // })();
// // // Import config first to ensure environment variables are loaded
// // import { config } from "./config";

// // import express, { type Request, Response, NextFunction } from "express";
// // import { registerRoutes } from "./routes";
// // import { setupVite, serveStatic, log } from "./vite";
// // import pg from "pg";

// // // --- THIS IS THE DEFINITIVE TIMESTAMP FIX ---
// // // The postgres driver (pg) by default can misinterpret timestamps.
// // // This line forces the driver to parse timestamp fields (type OID 1114)
// // // into proper JavaScript Date objects, correctly interpreting them as UTC.
// // // Adding the 'Z' suffix ensures the string is parsed as UTC.
// // pg.types.setTypeParser(1114, (stringValue) => new Date(stringValue + "Z"));
// // // ------------------------------------------

// // const app = express();
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));

// // app.use((req, res, next) => {
// //   const start = Date.now();
// //   const path = req.path;
// //   let capturedJsonResponse: Record<string, any> | undefined = undefined;

// //   const originalResJson = res.json;
// //   res.json = function (bodyJson, ...args) {
// //     capturedJsonResponse = bodyJson;
// //     return originalResJson.apply(res, [bodyJson, ...args]);
// //   };

// //   res.on("finish", () => {
// //     const duration = Date.now() - start;
// //     if (path.startsWith("/api")) {
// //       let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
// //       if (capturedJsonResponse) {
// //         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
// //       }

// //       if (logLine.length > 80) {
// //         logLine = logLine.slice(0, 79) + "…";
// //       }

// //       log(logLine);
// //     }
// //   });

// //   next();
// // });

// // (async () => {
// //   const server = await registerRoutes(app);

// //   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
// //     const status = err.status || err.statusCode || 500;
// //     const message = err.message || "Internal Server Error";

// //     res.status(status).json({ message });
// //     throw err;
// //   });

// //   // importantly only setup vite in development and after
// //   // setting up all the other routes so the catch-all route
// //   // doesn't interfere with the other routes
// //   if (app.get("env") === "development") {
// //     await setupVite(app, server);
// //   } else {
// //     serveStatic(app);
// //   }

// //   // ALWAYS serve the app on the port specified in the environment variable PORT
// //   // Other ports are firewalled. Default to 5000 if not specified.
// //   // this serves both the API and the client.
// //   // It is the only port that is not firewalled.
// //   const port = config.PORT;
// //   server.listen({
// //     port,
// //     host: "0.0.0.0",
// //     reusePort: true,
// //   }, () => {
// //     log(`serving on port ${port}`);
// //   });
// // })();

// THE FIX: Explicitly load the .env file with its full path at the very top.
// (dotenv is now loaded at the top of the file)

// // Import config AFTER dotenv has run to ensure variables are loaded.
// import { config } from "./config";
// import express, { type Request, Response, NextFunction } from "express";
// import { registerRoutes } from "./routes";
// import { setupVite, serveStatic, log } from "./vite";
// import pg from "pg";

// // This timestamp fix is still important for correct time display.
// pg.types.setTypeParser(1114, (stringValue) => new Date(stringValue + "Z"));

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Logging middleware (no changes needed here).
// app.use((req, res, next) => {
//   const start = Date.now();
//   const reqPath = req.path;
//   let capturedJsonResponse: Record<string, any> | undefined = undefined;

//   const originalResJson = res.json;
//   res.json = function (bodyJson, ...args) {
//     capturedJsonResponse = bodyJson;
//     return originalResJson.apply(res, [bodyJson, ...args]);
//   };

//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     if (reqPath.startsWith("/api")) {
//       let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
//       if (capturedJsonResponse) {
//         logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
//       }
//       if (logLine.length > 80) {
//         logLine = logLine.slice(0, 79) + "…";
//       }
//       log(logLine);
//     }
//   });

//   next();
// });

// (async () => {
//   const server = await registerRoutes(app);

//   app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
//     const status = err.status || err.statusCode || 500;
//     const message = err.message || "Internal Server Error";
//     res.status(status).json({ message });
//     throw err;
//   });

//   if (app.get("env") === "development") {
//     await setupVite(app, server);
//   } else {
//     serveStatic(app);
//   }

//   const port = config.PORT;
//   server.listen(
//     {
//       port,
//       host: "0.0.0.0",
//       reusePort: true,
//     },
//     () => {
//       log(`serving on port ${port}`);
//     }
//   );
// })();

// All dotenv and path imports are removed.
// Environment variables are now loaded by the "dev" script in package.json.
import { config } from "./config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import pg from "pg";

pg.types.setTypeParser(1114, (stringValue) => new Date(stringValue + "Z"));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = config.PORT;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    }
  );
})();