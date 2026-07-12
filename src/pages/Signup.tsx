import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowRight, Building2, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [form, setForm] = useState({
    cooperativeName: "",
    email: "",
    phone: "",
    password: "",
  });

  const slugify = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.cooperativeName },
          emailRedirectTo: `${window.location.origin}/cooperative`,
        },
      });

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes("email")) {
          throw new Error("Could not send confirmation email. Ask your administrator to disable email confirmation in Supabase Auth settings, or configure an SMTP provider.");
        }
        throw new Error(signUpError.message);
      }
      if (!authData.user) throw new Error("Signup failed — please try again.");

      // 2. Create tenant + link user atomically via RPC
      const { error: tenantError } = await supabase.rpc("create_tenant", {
        p_name: form.cooperativeName,
        p_email: form.email,
        p_slug: slugify(form.cooperativeName),
        p_phone: form.phone || null,
      });

      if (tenantError) throw new Error(tenantError.message);

      // If Supabase requires email confirmation, session will be null
      if (!authData.session) {
        setVerificationSent(true);
        return;
      }

      navigate("/cooperative", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    await supabase.auth.resend({ type: "signup", email: form.email });
    setResending(false);
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">Check your inbox</h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We sent a verification link to <strong className="text-foreground">{form.email}</strong>.
                Click the link in that email to activate your cooperative account.
              </p>
            </div>

            <div className="bg-muted/40 border border-border rounded-xl p-5 text-left space-y-3">
              {[
                "Check your spam/junk folder if you don't see it",
                "The link expires in 24 hours",
                "After clicking the link you'll be taken to your dashboard",
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              disabled={resending}
              onClick={handleResend}
            >
              {resending ? "Sending…" : "Resend verification email"}
            </Button>

            <p className="text-sm text-muted-foreground">
              Wrong email?{" "}
              <button
                onClick={() => setVerificationSent(false)}
                className="text-primary font-medium hover:underline"
              >
                Go back and change it
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A0A0A] flex-col justify-between p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(42 55% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(42 55% 55%) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="flex items-center gap-3 relative">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">J</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">Jollify</span>
        </div>

        <div className="relative space-y-8">
          <blockquote className="text-white/90 text-2xl font-light leading-relaxed tracking-tight">
            "Set up in minutes. Serve your members from day one."
          </blockquote>

          <div className="space-y-4">
            {[
              "30-day free trial — no card required",
              "All member data encrypted and isolated",
              "Paystack integration ready out of the box",
            ].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <span className="text-white/60 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs relative">© 2025 Jollify. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">J</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Jollify</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Register your cooperative</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Create your admin account and start managing your cooperative.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="cooperativeName">Cooperative name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cooperativeName"
                  placeholder="Lagos Teachers Cooperative Society"
                  required
                  value={form.cooperativeName}
                  onChange={(e) => setForm({ ...form, cooperativeName: e.target.value })}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Admin email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yourcooperative.com"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create account <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
