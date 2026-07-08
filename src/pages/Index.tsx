import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  PiggyBank,
  CreditCard,
  Shield,
  TrendingUp,
  FileText,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/cooperative");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">J</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-foreground">Jollify</span>
              <span className="text-muted-foreground text-sm ml-1.5 font-normal">Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get started <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <Badge variant="outline" className="mb-6 border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-xs font-medium tracking-wide uppercase">
          Cooperative Management Platform
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
          Run your cooperative
          <br />
          <span className="text-gold-gradient">with precision.</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Jollify gives cooperative administrators a single platform to manage members,
          track contributions, process loans, and distribute dividends — with bank-grade
          security built in from day one.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/login">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-base font-semibold">
              Start free trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/cooperative">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border hover:bg-muted/50">
              View demo
            </Button>
          </Link>
        </div>

        {/* Trust bar */}
        <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
          {[
            { icon: Lock, text: "Bank-grade security" },
            { icon: Shield, text: "Double-entry ledger" },
            { icon: CheckCircle2, text: "Paystack integrated" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">Platform Modules</h2>
            <p className="text-muted-foreground">Everything your cooperative needs, in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cooperative — active */}
            <Link to="/cooperative" className="group">
              <div className="border-2 border-primary/30 rounded-xl p-6 bg-primary/5 hover:bg-primary/10 transition-all duration-200 h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">Cooperative Module</h3>
                  <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Full member lifecycle management, contribution tracking, loan processing, and dividend distribution.
                </p>
                <div className="flex items-center gap-1.5 text-primary text-sm font-medium">
                  Access module <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>

            {/* Share Registry — coming soon */}
            <div className="border border-border rounded-xl p-6 opacity-60 cursor-not-allowed bg-white">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <PiggyBank className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">Share Registry</h3>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">Coming soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Complete share registry for public and private companies with dividend processing and corporate actions.
              </p>
            </div>

            {/* Investment — coming soon */}
            <div className="border border-border rounded-xl p-6 opacity-60 cursor-not-allowed bg-white">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">Investment Management</h3>
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">Coming soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional investment management for fund managers with portfolio tracking and analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground tracking-tight mb-3">Built for serious operators</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The disciplines that make Jollify bank-grade are built in from day one — not bolted on later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Users,
              title: "Member Management",
              desc: "Full lifecycle from invite to exit — KYC verification, status management, and detailed member profiles.",
            },
            {
              icon: PiggyBank,
              title: "Contribution Tracking",
              desc: "Every contribution posted to a double-entry ledger. Balances computed, never stored as a mutable number.",
            },
            {
              icon: CreditCard,
              title: "Loan Processing",
              desc: "Application, review, disbursement, and repayment tracking across configurable loan products.",
            },
            {
              icon: TrendingUp,
              title: "Dividend Distribution",
              desc: "Calculate entitlements per share balance, declare dividends, and process member payouts.",
            },
            {
              icon: Shield,
              title: "Tenant Isolation",
              desc: "Row-level security enforced at the database layer. Cooperative A cannot read Cooperative B's data.",
            },
            {
              icon: FileText,
              title: "Reports & Audit Trail",
              desc: "Immutable audit log of every action. Financial reports in PDF and Excel on demand.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-4.5 w-4.5 text-primary h-[18px] w-[18px]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[10px]">J</span>
            </div>
            <span className="text-sm font-semibold text-foreground">Jollify</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Jollify. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
