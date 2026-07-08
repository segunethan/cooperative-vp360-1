import { createMiddleware } from "hono/factory";
import { createClient } from "@supabase/supabase-js";
import { unauthorized, forbidden } from "../lib/response";
import type { Env } from "../lib/supabase";

export type AuthVariables = {
  userId: string;
  tenantId: string;
  userRole: string;
  userEmail: string;
};

export const authMiddleware = createMiddleware<{ Bindings: Env; Variables: AuthVariables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return unauthorized(c);
    }

    const token = authHeader.slice(7);

    const client = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: { user }, error: authError } = await client.auth.getUser(token);
    if (authError || !user) {
      return unauthorized(c, "Invalid or expired token");
    }

    const { data: tenantUser, error: tuError } = await client
      .from("tenant_users")
      .select("tenant_id, role")
      .eq("user_id", user.id)
      .single();

    if (tuError || !tenantUser) {
      return forbidden(c, "No cooperative account found for this user");
    }

    c.set("userId", user.id);
    c.set("tenantId", tenantUser.tenant_id as string);
    c.set("userRole", tenantUser.role as string);
    c.set("userEmail", user.email ?? "");

    return next();
  }
);

export const requireAdmin = createMiddleware<{ Bindings: Env; Variables: AuthVariables }>(
  async (c, next) => {
    const role = c.get("userRole");
    if (!["admin", "owner"].includes(role)) {
      return forbidden(c, "Admin access required");
    }
    return next();
  }
);
