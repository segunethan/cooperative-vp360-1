import { Hono } from "hono";
import type { Env } from "../../lib/supabase";
import type { AuthVariables } from "../../middleware/auth";
import members from "./members";
import contributions from "./contributions";
import loans from "./loans";
import dividends from "./dividends";
import announcements from "./announcements";
import cooperative from "./cooperative";

const v1 = new Hono<{ Bindings: Env; Variables: AuthVariables }>();

v1.route("/members", members);
v1.route("/contributions", contributions);
v1.route("/loans", loans);
v1.route("/dividends", dividends);
v1.route("/announcements", announcements);
v1.route("/cooperative", cooperative);

export default v1;
