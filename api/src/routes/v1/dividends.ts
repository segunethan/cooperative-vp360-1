import { Hono } from "hono";
import { adminClient, type Env } from "../../lib/supabase";
import { ok, created, badRequest, notFound, pageMeta } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

const dividends = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// GET /v1/dividends
dividends.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const page = parseInt(c.req.query("page") ?? "1");
  const pageSize = Math.min(parseInt(c.req.query("pageSize") ?? "20"), 100);
  const offset = (page - 1) * pageSize;

  const { data, error, count } = await db
    .from("dividends")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error) return badRequest(c, error.message);
  return ok(c, data, pageMeta(count ?? 0, page, pageSize));
});

// GET /v1/dividends/:id/entitlements
dividends.get("/:id/entitlements", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const dividendId = c.req.param("id");

  // Verify dividend belongs to tenant
  const { data: div } = await db
    .from("dividends")
    .select("id")
    .eq("id", dividendId)
    .eq("tenant_id", tenantId)
    .single();

  if (!div) return notFound(c, "Dividend", dividendId);

  const { data, error } = await db
    .from("dividend_entitlements")
    .select("id, share_balance_kobo, entitlement_kobo, paid_at, member:members(member_number, full_name)")
    .eq("dividend_id", dividendId)
    .order("entitlement_kobo", { ascending: false });

  if (error) return badRequest(c, error.message);
  return ok(c, data);
});

// POST /v1/dividends — declare dividend
dividends.post("/", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const userId = c.get("userId");
  const body = await c.req.json<{
    period: string;
    rate_percent: number;
    qualification_date: string;
    payout_date?: string;
  }>();

  if (!body.period?.trim()) return badRequest(c, "period is required (e.g. Q2 2026)");
  if (!body.rate_percent || body.rate_percent <= 0 || body.rate_percent > 100) {
    return badRequest(c, "rate_percent must be between 0.01 and 100");
  }
  if (!body.qualification_date) return badRequest(c, "qualification_date is required");

  const rateBps = Math.round(body.rate_percent * 100);

  // Fetch ACTIVE members
  const { data: members } = await db
    .from("members")
    .select("id, member_number, full_name")
    .eq("tenant_id", tenantId)
    .eq("status", "ACTIVE");

  if (!members?.length) return badRequest(c, "No active members found");

  // Fetch COMPLETED contributions up to qualification date
  const { data: contribs } = await db
    .from("contributions")
    .select("member_id, amount_kobo")
    .eq("tenant_id", tenantId)
    .eq("status", "COMPLETED")
    .lte("created_at", `${body.qualification_date}T23:59:59.999Z`);

  // Sum contributions per member
  const totals = new Map<string, number>();
  for (const c of contribs ?? []) {
    totals.set(c.member_id, (totals.get(c.member_id) ?? 0) + c.amount_kobo);
  }

  const qualifying = members
    .filter((m) => (totals.get(m.id) ?? 0) > 0)
    .map((m) => ({
      memberId: m.id,
      totalKobo: totals.get(m.id)!,
      entitlementKobo: Math.floor((totals.get(m.id)! * rateBps) / 10_000),
    }));

  if (!qualifying.length) {
    return badRequest(c, "No members qualify — none have completed contributions before the qualification date");
  }

  const totalAmountKobo = qualifying.reduce((s, m) => s + m.entitlementKobo, 0);

  // Insert dividend record
  const { data: dividend, error: divError } = await db
    .from("dividends")
    .insert({
      tenant_id: tenantId,
      period: body.period.trim(),
      rate_bps: rateBps,
      total_amount_kobo: totalAmountKobo,
      eligible_members: qualifying.length,
      qualification_date: body.qualification_date,
      payout_date: body.payout_date ?? null,
      status: "DECLARED",
      declared_by: userId,
      declared_at: new Date().toISOString(),
      calculation_method: "per_contribution",
    })
    .select("id, period, rate_bps, total_amount_kobo, eligible_members, status, declared_at")
    .single();

  if (divError) return badRequest(c, divError.message);

  // Insert entitlements in one batch
  const { error: entError } = await db.from("dividend_entitlements").insert(
    qualifying.map((m) => ({
      tenant_id: tenantId,
      dividend_id: dividend!.id,
      member_id: m.memberId,
      share_balance_kobo: m.totalKobo,
      entitlement_kobo: m.entitlementKobo,
    }))
  );

  if (entError) return badRequest(c, entError.message);
  return created(c, dividend);
});

export default dividends;
