import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Northwind Kanban" },
      { name: "description", content: "Start a free Northwind workspace and organise your first project board." },
      { property: "og:title", content: "Create account — Northwind Kanban" },
      { property: "og:description", content: "Start a free Northwind workspace and organise your first project board." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title="Create your workspace"
      subtitle="Free for teams of up to five people."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Workspace created");
          navigate({ to: "/" });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required placeholder="Ada Obi" autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required placeholder="you@company.com" autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required placeholder="At least 8 characters" autoComplete="new-password" />
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox required className="mt-0.5" /> I agree to the terms of service and privacy policy.
        </label>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
