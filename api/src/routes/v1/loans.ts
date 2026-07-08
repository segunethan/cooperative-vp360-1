import { Hono } from "hono";
import { adminClient, nairaToKobo, generateRef, type Env } from "../../lib/supabase";
import { ok, created, badRequest, notFound, pageMeta } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

const loans = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// GET /v1/loans
loans.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const page = parseInt(c.req.query("page") ?? "1");
  const pageSize = Math.min(parseInt(c.req.query("pageSize") ?? "20"), 100);
  const status = c.req.query("status");
  const offset = (page - 1) * pageSize;

  let query = db
    .from("loans")
    .select(
      "id, loan_number, principal_kobo, interest_rate_bps, tenure_months, purpose, status, due_date, disbursed_at, created_at, member:members(member_number, full_name)",
      { count: "exact" }
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) query = query.eq("status", status.toUpperCase());

  const { data, error, count } = await query;
  if (error) return badRequest(c, error.message);

  return ok(c, data, pageMeta(count ?? 0, page, pageSize));
});

// GET /v1/loans/:id
loans.get("/:id", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const loanNumber = c.req.param("id");

  const { data, error } = await db
    .from("loans")
    .select("*, member:members(member_number, full_name, email, phone)")
    .eq("tenant_id", tenantId)
    .eq("loan_number", loanNumber)
    .single();

  if (error || !data) return notFound(c, "Loan", loanNumber);
  return ok(c, data);
});

// POST /v1/loans — submit application
loans.post("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const body = await c.req.json<{
    member_number: string;
    amount_naira: number;
    interest_rate_percent: number;
    tenure_months: number;
    purpose?: string;
    notes?: string;
  }>();

  if (!body.member_number) return badRequest(c, "member_number is required");
  if (!body.amount_naira || body.amount_naira <= 0) return badRequest(c, "amount_naira must be positive");
  if (!body.interest_rate_percent || body.interest_rate_percent < 0) return badRequest(c, "interest_rate_percent is required");
  if (!body.tenure_months || body.tenure_months < 1) return badRequest(c, "tenure_months must be at least 1");

  const { data: member, error: memberError } = await db
    .from("members")
    .select("id")
    .eq("tenant_id", tenantId)
    .eq("member_number", body.member_number)
    .single();

  if (memberError || !member) return notFound(c, "Member", body.member_number);

  const { data, error } = await db
    .from("loans")
    .insert({
      tenant_id: tenantId,
      member_id: member.id,
      principal_kobo: nairaToKobo(body.amount_naira),
      interest_rate_bps: Math.round(body.interest_rate_percent * 100),
      tenure_months: body.tenure_months,
      purpose: body.purpose ?? null,
      notes: body.notes ?? null,
      status: "PENDING",
    })
    .select("id, loan_number, principal_kobo, status, created_at")
    .single();

  if (error) return badRequest(c, error.message);
  return created(c, data);
});

// POST /v1/loans/:id/approve
loans.post("/:id/approve", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const userId = c.get("userId");
  const loanId = c.req.param("id");

  const { error } = await db
    .from("loans")
    .update({
      status: "APPROVED",
      approved_by: userId,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", loanId)
    .eq("tenant_id", tenantId)
    .eq("status", "PENDING");

  if (error) return badRequest(c, error.message);
  return ok(c, { id: loanId, status: "APPROVED" });
});

// POST /v1/loans/:id/reject
loans.post("/:id/reject", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const loanId = c.req.param("id");
  const body = await c.req.json<{ reason?: string }>().catch(() => ({ reason: undefined }));

  const { error } = await db
    .from("loans")
    .update({ status: "REJECTED", rejection_reason: body.reason ?? null, updated_at: new Date().toISOString() })
    .eq("id", loanId)
    .eq("tenant_id", tenantId);

  if (error) return badRequest(c, error.message);
  return ok(c, { id: loanId, status: "REJECTED" });
});

// POST /v1/loans/:id/disburse
loans.post("/:id/disburse", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const loanId = c.req.param("id");
  const body = await c.req.json<{ tenure_months?: number; paystack_reference?: string }>().catch(() => ({ tenure_months: undefined, paystack_reference: undefined }));

  // Fetch loan to get tenure_months if not overridden
  const { data: loan } = await db.from("loans").select("tenure_months").eq("id", loanId).single();
  const tenure = body.tenure_months ?? loan?.tenure_months ?? 12;
  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + tenure);

  const { error } = await db
    .from("loans")
    .update({
      status: "ACTIVE",
      disbursed_at: new Date().toISOString(),
      due_date: dueDate.toISOString().split("T")[0],
      paystack_reference: body.paystack_reference ?? generateRef("DISB"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", loanId)
    .eq("tenant_id", tenantId)
    .eq("status", "APPROVED");

  if (error) return badRequest(c, error.message);
  return ok(c, { id: loanId, status: "ACTIVE", due_date: dueDate.toISOString().split("T")[0] });
});

export default loans;
