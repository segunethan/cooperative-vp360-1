import { Hono } from "hono";
import { adminClient, type Env } from "../../lib/supabase";
import { ok, badRequest, notFound } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

const cooperative = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// GET /v1/cooperative — current tenant profile
cooperative.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");

  const { data, error } = await db
    .from("tenants")
    .select("id, name, slug, cooperative_number, email, phone, address, rc_number, billing_plan, status, created_at")
    .eq("id", tenantId)
    .single();

  if (error || !data) return notFound(c, "Cooperative", tenantId);
  return ok(c, data);
});

// PATCH /v1/cooperative
cooperative.patch("/", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const body = await c.req.json<Record<string, unknown>>();

  const allowed = ["name", "email", "phone", "address", "rc_number"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await db
    .from("tenants")
    .update(updates)
    .eq("id", tenantId)
    .select("id, name, slug, cooperative_number, email, phone, address, rc_number, updated_at")
    .single();

  if (error) return badRequest(c, error.message);
  return ok(c, data);
});

// GET /v1/cooperative/stats — dashboard metrics
cooperative.get("/stats", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");

  const [members, contributions, loans] = await Promise.all([
    db.from("members").select("status", { count: "exact" }).eq("tenant_id", tenantId),
    db.from("contributions").select("amount_kobo").eq("tenant_id", tenantId).eq("status", "COMPLETED"),
    db.from("loans").select("principal_kobo, status").eq("tenant_id", tenantId),
  ]);

  const memberData = members.data ?? [];
  const totalMembers = memberData.length;
  const activeMembers = memberData.filter((m) => m.status === "ACTIVE").length;

  const totalContributionsKobo = (contributions.data ?? []).reduce((s, c) => s + c.amount_kobo, 0);

  const loanData = loans.data ?? [];
  const activeLoansKobo = loanData.filter((l) => l.status === "ACTIVE").reduce((s, l) => s + l.principal_kobo, 0);
  const pendingLoans = loanData.filter((l) => l.status === "PENDING").length;

  return ok(c, {
    members: { total: totalMembers, active: activeMembers },
    contributions: { total_kobo: totalContributionsKobo },
    loans: { active_portfolio_kobo: activeLoansKobo, pending_count: pendingLoans },
  });
});

export default cooperative;
