import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Northwind Kanban" },
      { name: "description", content: "Request a password reset link for your Northwind workspace." },
      { property: "og:title", content: "Reset password — Northwind Kanban" },
      { property: "og:description", content: "Request a password reset link for your Northwind workspace." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link to choose a new one."
      footer={
        <Link to="/login" className="font-medium text-brand hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="rise-in flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <MailCheck className="h-5 w-5" />
          </span>
          <p className="font-semibold">Check your inbox</p>
          <p className="text-sm text-muted-foreground">
            If that address exists we've sent a reset link. It expires in 30 minutes.
          </p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@company.com" autoComplete="email" />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
