import { Hono } from "hono";
import { logger } from "hono/logger";
import { corsMiddleware } from "./middleware/cors";
import { authMiddleware } from "./middleware/auth";
import v1 from "./routes/v1/index";
import type { Env } from "./lib/supabase";
import type { AuthVariables } from "./middleware/auth";

const app = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use("*", corsMiddleware);
app.use("*", logger());
app.use("/v1/*", authMiddleware);

// ── Health check (no auth) ────────────────────────────────────────────────────
app.get("/", (c) =>
  c.json({
    name: "Jollify API",
    version: "1.0.0",
    status: "ok",
    docs: "https://docs.jollify.app",
  })
);

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── v1 routes (all protected by auth) ────────────────────────────────────────
app.route("/v1", v1);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.notFound((c) =>
  c.json(
    {
      data: null,
      error: {
        code: "NOT_FOUND",
        message: `Route ${c.req.method} ${c.req.path} not found`,
      },
    },
    404
  )
);

// ── Global error handler ──────────────────────────────────────────────────────
app.onError((err, c) => {
  console.error("[API Error]", err);
  return c.json(
    {
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
    },
    500
  );
});

export default app;
