import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: (origin) => {
    const allowed = [
      "https://app.jollify.app",
      "https://jollify.app",
      "http://localhost:8080",
      "http://localhost:3000",
    ];
    return allowed.includes(origin) ? origin : "https://app.jollify.app";
  },
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Authorization", "Content-Type", "X-Request-ID"],
  exposeHeaders: ["X-Request-ID"],
  maxAge: 86400,
  credentials: true,
});
