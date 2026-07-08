import { Hono } from "hono";
import { adminClient, nairaToKobo, generateRef, type Env } from "../../lib/supabase";
import { ok, created, badRequest, notFound, pageMeta } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

const contributions = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// GET /v1/contributions
contributions.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const page = parseInt(c.req.query("page") ?? "1");
  const pageSize = Math.min(parseInt(c.req.query("pageSize") ?? "20"), 100);
  const status = c.req.query("status");
  const memberId = c.req.query("member_id");
  const offset = (page - 1) * pageSize;

  let query = db
    .from("contributions")
    .select(
      "id, amount_kobo, channel, status, reference, created_at, member:members(member_number, full_name)",
      { count: "exact" }
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) query = query.eq("status", status.toUpperCase());
  if (memberId) {
    const { data: m } = await db.from("members").select("id").eq("member_number", memberId).single();
    if (m) query = query.eq("member_id", m.id);
  }

  const { data, error, count } = await query;
  if (error) return badRequest(c, error.message);

  return ok(c, data, pageMeta(count ?? 0, page, pageSize));
});

// POST /v1/contributions  — record an offline contribution
contributions.post("/", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const body = await c.req.json<{
    member_number: string;
    amount_naira: number;
    channel: string;
    period_month?: number;
    period_year?: number;
    notes?: string;
  }>();

  if (!body.member_number) return badRequest(c, "member_number is required");
  if (!body.amount_naira || body.amount_naira <= 0) return badRequest(c, "amount_naira must be positive");
  if (!body.channel) return badRequest(c, "channel is required");

  const { data: member, error: memberError } = await db
    .from("members")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("member_number", body.member_number)
    .single();

  if (memberError || !member) return notFound(c, "Member", body.member_number);

  const { data, error } = await db
    .from("contributions")
    .insert({
      tenant_id: tenantId,
      member_id: member.id,
      amount_kobo: nairaToKobo(body.amount_naira),
      channel: body.channel,
      status: "PENDING",
      reference: generateRef("CONTRIB"),
      period_month: body.period_month ?? null,
      period_year: body.period_year ?? new Date().getFullYear(),
      notes: body.notes ?? null,
    })
    .select("id, amount_kobo, channel, status, reference, created_at")
    .single();

  if (error) return badRequest(c, error.message);
  return created(c, data);
});

// POST /v1/contributions/:id/approve
contributions.post("/:id/approve", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const id = c.req.param("id");

  const { error } = await db
    .from("contributions")
    .update({ status: "COMPLETED", completed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .eq("status", "PENDING");

  if (error) return badRequest(c, error.message);
  return ok(c, { id, status: "COMPLETED" });
});

// POST /v1/contributions/:id/reject
contributions.post("/:id/reject", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const id = c.req.param("id");

  const { error } = await db
    .from("contributions")
    .update({ status: "FAILED" })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .eq("status", "PENDING");

  if (error) return badRequest(c, error.message);
  return ok(c, { id, status: "FAILED" });
});

export default contributions;
