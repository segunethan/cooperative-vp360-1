import { Hono } from "hono";
import { adminClient, type Env } from "../../lib/supabase";
import { ok, created, badRequest, notFound, pageMeta } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

type Vars = AuthVariables;

const members = new Hono<{ Bindings: Env; Variables: Vars }>();

// GET /v1/members
members.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const page = parseInt(c.req.query("page") ?? "1");
  const pageSize = Math.min(parseInt(c.req.query("pageSize") ?? "20"), 100);
  const status = c.req.query("status"); // ACTIVE | INVITED | SUSPENDED | EXITED
  const search = c.req.query("search");
  const offset = (page - 1) * pageSize;

  let query = db
    .from("members")
    .select("id, member_number, full_name, email, phone, status, kyc_verified, joined_at, created_at", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) query = query.eq("status", status.toUpperCase());
  if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,member_number.ilike.%${search}%`);

  const { data, error, count } = await query;
  if (error) return badRequest(c, error.message);

  return ok(c, data, pageMeta(count ?? 0, page, pageSize));
});

// GET /v1/members/:id
members.get("/:id", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const memberNumber = c.req.param("id");

  const { data, error } = await db
    .from("members")
    .select("*")
    .eq("tenant_id", tenantId)
    .eq("member_number", memberNumber)
    .single();

  if (error || !data) return notFound(c, "Member", memberNumber);

  const [contribs, loans] = await Promise.all([
    db.from("contributions").select("amount_kobo").eq("member_id", data.id).eq("status", "COMPLETED"),
    db.from("loans").select("principal_kobo").eq("member_id", data.id).eq("status", "ACTIVE"),
  ]);

  return ok(c, {
    ...data,
    contribution_total_kobo: (contribs.data ?? []).reduce((s, r) => s + r.amount_kobo, 0),
    loan_total_kobo: (loans.data ?? []).reduce((s, r) => s + r.principal_kobo, 0),
  });
});

// POST /v1/members
members.post("/", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const body = await c.req.json<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender?: string;
    date_of_birth?: string;
    address?: string;
    occupation?: string;
  }>();

  if (!body.first_name || !body.last_name || !body.email || !body.phone) {
    return badRequest(c, "first_name, last_name, email, and phone are required");
  }

  const { data, error } = await db
    .from("members")
    .insert({
      tenant_id: tenantId,
      full_name: `${body.first_name.trim()} ${body.last_name.trim()}`,
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      gender: body.gender ?? null,
      date_of_birth: body.date_of_birth ?? null,
      address: body.address ?? null,
      occupation: body.occupation ?? null,
      status: "INVITED",
    })
    .select("member_number, full_name, email, status, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return badRequest(c, "A member with this email already exists", "DUPLICATE_EMAIL");
    return badRequest(c, error.message);
  }

  return created(c, data);
});

// PATCH /v1/members/:id
members.patch("/:id", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const memberNumber = c.req.param("id");
  const body = await c.req.json<Record<string, unknown>>();

  const allowed = ["full_name", "phone", "gender", "date_of_birth", "address", "occupation"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  const { data, error } = await db
    .from("members")
    .update(updates)
    .eq("tenant_id", tenantId)
    .eq("member_number", memberNumber)
    .select("member_number, full_name, email, phone, status, updated_at")
    .single();

  if (error || !data) return notFound(c, "Member", memberNumber);
  return ok(c, data);
});

// POST /v1/members/:id/approve
members.post("/:id/approve", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const memberNumber = c.req.param("id");

  const { error } = await db
    .from("members")
    .update({ status: "ACTIVE", updated_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("member_number", memberNumber);

  if (error) return badRequest(c, error.message);
  return ok(c, { member_number: memberNumber, status: "ACTIVE" });
});

// POST /v1/members/:id/suspend
members.post("/:id/suspend", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const memberNumber = c.req.param("id");
  const body = await c.req.json<{ reason?: string }>().catch(() => ({ reason: undefined }));

  const { error } = await db
    .from("members")
    .update({ status: "SUSPENDED", suspension_reason: body.reason ?? null, updated_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("member_number", memberNumber);

  if (error) return badRequest(c, error.message);
  return ok(c, { member_number: memberNumber, status: "SUSPENDED" });
});

// POST /v1/members/:id/exit
members.post("/:id/exit", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const memberNumber = c.req.param("id");

  const { error } = await db
    .from("members")
    .update({ status: "EXITED", exited_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("tenant_id", tenantId)
    .eq("member_number", memberNumber);

  if (error) return badRequest(c, error.message);
  return ok(c, { member_number: memberNumber, status: "EXITED" });
});

export default members;
