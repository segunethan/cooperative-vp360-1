import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { memberName, memberNumber, memberEmail, cooperativeName, cooperativeNumber } =
      await req.json();

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ${cooperativeName}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e7e5e4;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px;border-bottom:1px solid #f0ede8;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#0a0a0a;width:36px;height:36px;border-radius:8px;text-align:center;vertical-align:middle;">
                    <span style="font-size:18px;font-weight:800;color:#CBA54D;line-height:36px;display:block;">J</span>
                  </td>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <span style="font-size:20px;font-weight:700;color:#0a0a0a;letter-spacing:-0.3px;">Jollify</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Gold accent bar -->
          <tr>
            <td style="background:linear-gradient(90deg,#CBA54D,#e8c76a);height:3px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#0a0a0a;letter-spacing:-0.4px;">
                Welcome, ${memberName}!
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.65;">
                You have been registered as a member of <strong style="color:#0a0a0a;">${cooperativeName}</strong>.
                Your membership details are below.
              </p>

              <!-- Member ID card -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 28px;background:#fafaf9;border:1px solid #f0ede8;border-radius:10px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#9ca3af;letter-spacing:0.8px;text-transform:uppercase;">Your Member ID</p>
                    <p style="margin:0;font-size:28px;font-weight:800;color:#0a0a0a;letter-spacing:1px;font-family:monospace;">${memberNumber}</p>
                    ${cooperativeNumber ? `<p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">Cooperative ID: <strong style="color:#6b7280;">${cooperativeNumber}</strong></p>` : ""}
                    <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">Keep this ID safe — you'll need it for all cooperative transactions.</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                Your membership is currently <strong style="color:#CBA54D;">pending approval</strong> from your cooperative administrator.
                You will receive another email once your account is activated.
              </p>

              <!-- Divider -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin:0 0 20px;">
                <tr><td style="border-top:1px solid #f0ede8;font-size:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:0;font-size:13px;color:#9ca3af;">
                Questions? Contact your cooperative administrator or reply to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #f0ede8;background:#fafaf9;">
              <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;">
                This invitation was sent by <strong>${cooperativeName}</strong> via Jollify.
              </p>
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                &copy; 2026 Jollify &middot; Cooperative Management Platform
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Jollify <noreply@jollify.app>",
        to: [memberEmail],
        subject: `You've been added to ${cooperativeName} — Your Member ID is ${memberNumber}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
