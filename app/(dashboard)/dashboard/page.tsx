import { DashboardHeader } from "@/features/dashboard/dashboard-header";
import { dashboardConfig } from "@/config";
import { OnboardingChecklistCard } from "@/features/onboarding/checklist-card";
import { requireAuth } from "@/lib/auth-utils";
import { completeOnboardingStep, getOnboardingSnapshot } from "@/lib/onboarding";

export default async function DashboardPage() {
  const session = await requireAuth();
  const onboardingEnabled = dashboardConfig.onboarding.enabled;

  if (onboardingEnabled) {
    await completeOnboardingStep(session.user.id, "learn-layout");
  }

  const onboarding = onboardingEnabled
    ? await getOnboardingSnapshot(session.user.id)
    : null;
  const nextStep = onboarding?.steps.find((step) => !step.completed);

  const overviewCards = onboarding
    ? [
        {
          label: "Progress",
          value: `${onboarding.completedCount}/${onboarding.totalSteps}`,
          note: onboarding.allComplete
            ? "Starter onboarding complete"
            : `${onboarding.progress}% of the setup checklist is done`,
        },
        {
          label: "Next Step",
          value: nextStep?.title ?? "You are all set",
          note: nextStep
            ? "Use the checklist above to move through the starter"
            : "You can now replace starter guidance with product data",
        },
        {
          label: "Starter Status",
          value: "Auth, AI, Billing",
          note: "Core building blocks are already wired in this starter",
        },
      ]
    : [
        {
          label: "Starter Status",
          value: "Auth, AI, Billing",
          note: "Core building blocks are already wired in this starter",
        },
        {
          label: "Onboarding",
          value: "Disabled",
          note: "Turn dashboard onboarding back on from config.ts whenever you want it.",
        },
        {
          label: "Next Step",
          value: "Build your product",
          note: "Replace starter surfaces with your app-specific data and flows.",
        },
      ];

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 space-y-6 p-6">
        {onboarding ? <OnboardingChecklistCard snapshot={onboarding} /> : null}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {overviewCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-dashed p-6 space-y-2"
            >
              <h3 className="text-sm font-medium text-muted-foreground">
                {card.label}
              </h3>
              <p className="text-lg font-semibold tracking-tight">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.note}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
