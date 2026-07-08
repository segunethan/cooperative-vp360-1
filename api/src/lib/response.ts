import { Context } from "hono";

export const ok = <T>(c: Context, data: T, meta?: Record<string, unknown>) =>
  c.json({ data, error: null, meta: meta ?? null }, 200);

export const created = <T>(c: Context, data: T) =>
  c.json({ data, error: null, meta: null }, 201);

export const noContent = (_c: Context) => new Response(null, { status: 204 });

export const badRequest = (c: Context, message: string, code = "BAD_REQUEST") =>
  c.json({ data: null, error: { code, message }, meta: null }, 400);

export const unauthorized = (c: Context, message = "Unauthorized") =>
  c.json({ data: null, error: { code: "UNAUTHORIZED", message }, meta: null }, 401);

export const forbidden = (c: Context, message = "Forbidden") =>
  c.json({ data: null, error: { code: "FORBIDDEN", message }, meta: null }, 403);

export const notFound = (c: Context, resource: string, id: string) =>
  c.json({ data: null, error: { code: "NOT_FOUND", message: `${resource} '${id}' not found` }, meta: null }, 404);

export const conflict = (c: Context, message: string) =>
  c.json({ data: null, error: { code: "CONFLICT", message }, meta: null }, 409);

export const serverError = (c: Context, message = "Internal server error") =>
  c.json({ data: null, error: { code: "INTERNAL_ERROR", message }, meta: null }, 500);

export const pageMeta = (total: number, page: number, pageSize: number) => ({
  total,
  page,
  pageSize,
  totalPages: Math.ceil(total / pageSize),
});
