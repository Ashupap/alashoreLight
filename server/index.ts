import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Increase payload limits for file uploads (but keep reasonable for JSON)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add detailed request logging especially for uploads
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  
  // Log upload attempts with size info
  if (path.includes('/api/media/upload')) {
    console.log(`=== INCOMING UPLOAD REQUEST ===`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${path}`);
    console.log(`Content-Type: ${req.headers['content-type']}`);
    console.log(`Content-Length: ${req.headers['content-length']}`);
    console.log(`User-Agent: ${req.headers['user-agent']}`);
  }
  
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    
    if (path.includes('/api/media/upload')) {
      console.log(`=== UPLOAD RESPONSE ===`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Duration: ${duration}ms`);
      if (capturedJsonResponse) {
        console.log(`Response: ${JSON.stringify(capturedJsonResponse)}`);
      }
      console.log(`=== END UPLOAD ===`);
    }
    
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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
  console.log("Environment:", process.env.NODE_ENV);
  console.log("Port:", process.env.PORT);
  console.log("Starting server registration...");
  const server = await registerRoutes(app);
  console.log("Routes registered successfully");

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
