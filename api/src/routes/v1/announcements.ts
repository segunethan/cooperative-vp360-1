import { Hono } from "hono";
import { adminClient, type Env } from "../../lib/supabase";
import { ok, created, badRequest, pageMeta } from "../../lib/response";
import { requireAdmin } from "../../middleware/auth";
import type { AuthVariables } from "../../middleware/auth";

const announcements = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

// GET /v1/announcements
announcements.get("/", async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const page = parseInt(c.req.query("page") ?? "1");
  const pageSize = Math.min(parseInt(c.req.query("pageSize") ?? "20"), 100);
  const status = c.req.query("status");
  const offset = (page - 1) * pageSize;

  let query = db
    .from("announcements")
    .select("id, title, content, category, audience, status, published_at, created_at", { count: "exact" })
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) query = query.eq("status", status.toUpperCase());

  const { data, error, count } = await query;
  if (error) return badRequest(c, error.message);

  return ok(c, data, pageMeta(count ?? 0, page, pageSize));
});

// POST /v1/announcements
announcements.post("/", requireAdmin, async (c) => {
  const db = adminClient(c.env);
  const tenantId = c.get("tenantId");
  const userId = c.get("userId");
  const body = await c.req.json<{
    title: string;
    content: string;
    category: string;
    audience: string;
    publish?: boolean;
  }>();

  if (!body.title?.trim()) return badRequest(c, "title is required");
  if (!body.content?.trim()) return badRequest(c, "content is required");
  if (!body.category) return badRequest(c, "category is required");
  if (!body.audience) return badRequest(c, "audience is required");

  const now = new Date().toISOString();
  const isPublished = body.publish === true;

  const { data, error } = await db
    .from("announcements")
    .insert({
      tenant_id: tenantId,
      created_by: userId,
      title: body.title.trim(),
      content: body.content.trim(),
      category: body.category.toLowerCase(),
      audience: body.audience,
      status: isPublished ? "PUBLISHED" : "DRAFT",
      published_at: isPublished ? now : null,
    })
    .select("id, title, category, audience, status, published_at, created_at")
    .single();

  if (error) return badRequest(c, error.message);
  return created(c, data);
});

export default announcements;
