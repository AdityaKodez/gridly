import { DashboardHeader } from "@/features/dashboard/dashboard-header";
import { requireAuth } from "@/lib/auth-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { plansConfig } from "@/config";
import { ManageBillingButton } from "@/features/dashboard/manage-billing-button";

export default async function SettingsPage() {
  const session = await requireAuth();
  const { user } = session;
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      planSlug: true,
      planStatus: true,
    },
  });

  const currentPlan =
    plansConfig.find((plan) => plan.slug === dbUser?.planSlug)?.name ?? "Free";
  const isActivePlan = dbUser?.planStatus === "active";

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email.charAt(0).toUpperCase();

  return (
    <>
      <DashboardHeader title="Settings" />
      <div className="p-6 flex justify-center size-full">
        <div className="w-full space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>
                Your account information from your sign-in provider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="text-lg font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User ID
                  </p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {user.id.slice(0, 16)}...
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Email Verified
                  </p>
                  <Badge
                    variant={user.emailVerified ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.emailVerified ? "Verified" : "Not verified"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Billing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Billing</CardTitle>
              <CardDescription>
                Manage your subscription and payment methods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Current Plan</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {currentPlan}
                    </p>
                    <Badge variant={isActivePlan ? "default" : "secondary"}>
                      {isActivePlan ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <ManageBillingButton />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base text-destructive">
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" size="sm" disabled>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
