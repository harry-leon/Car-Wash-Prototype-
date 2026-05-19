import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, LockKeyhole, Mail, ShieldCheck, User, Wrench } from "lucide-react";
import { toast } from "sonner";
import { GuestLayout } from "@/components/guest-layout";
import { GuestOnly } from "@/components/route-guards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getHomePath } from "@/lib/auth";
import { type Role, useCarwashStore } from "@/lib/carwash-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const LOGIN_ROLES: { role: Role; icon: React.ElementType; label: string }[] = [
  { role: "Customer", icon: User, label: "Customer" },
  { role: "Staff", icon: Wrench, label: "Staff" },
  { role: "Admin", icon: ShieldCheck, label: "Admin" }
];

function LoginPage() {
  const navigate = useNavigate();
  const { loginAs } = useCarwashStore();
  const [email, setEmail] = React.useState("demo@autowash.pro");
  const [password, setPassword] = React.useState("password123");
  const [role, setRole] = React.useState<Role>("Customer");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return toast.error("Email is required.");
    if (!password.trim()) return toast.error("Password is required.");

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // slightly longer for animation
    loginAs(role);
    toast.success(`Welcome to the ${role} workspace`);
    navigate({ to: getHomePath(role) });
  };

  return (
    <GuestOnly>
      <GuestLayout
        title="Welcome back"
        description="Sign in to your account to continue your journey with AutoWash Pro."
        footer={
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Create an account
            </Link>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link to="#" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/60 focus:bg-background transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-sm font-medium block mb-3">Select Workspace</Label>
            <div className="grid grid-cols-3 gap-3">
              {LOGIN_ROLES.map(({ role: roleName, icon: Icon, label }) => {
                const isActive = role === roleName;
                return (
                  <button
                    key={roleName}
                    type="button"
                    onClick={() => setRole(roleName)}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all duration-200 overflow-hidden",
                      isActive
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/60 bg-background/50 hover:border-primary/40 hover:bg-background"
                    )}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                    )}
                    <Icon 
                      className={cn(
                        "h-5 w-5 transition-colors relative z-10",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} 
                    />
                    <span className={cn(
                      "text-xs font-semibold relative z-10",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5" 
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      </GuestLayout>
    </GuestOnly>
  );
}
