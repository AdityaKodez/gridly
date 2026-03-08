import Link from "next/link";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OnboardingSnapshot } from "@/lib/onboarding";

import {
  dismissOnboardingAction,
  resumeOnboardingAction,
} from "./actions";
import { onboardingSectionConfig } from "./steps";

export function OnboardingChecklistCard({
  snapshot,
}: {
  snapshot: OnboardingSnapshot;
}) {
  if (!onboardingSectionConfig.enabled) {
    return null;
  }

  const nextStep = snapshot.steps.find((step) => !step.completed) ?? null;
  const openSteps = snapshot.steps.filter((step) => !step.completed);
  const completedSteps = snapshot.steps.filter((step) => step.completed);

  if (snapshot.allComplete) {
    return null;
  }

  if (snapshot.dismissed) {
    return (
      <Card size="sm" className="border-dashed">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{onboardingSectionConfig.hiddenTitle}</CardTitle>
            <CardDescription>
              {onboardingSectionConfig.hiddenDescription}
            </CardDescription>
          </div>
          <form action={resumeOnboardingAction}>
            <Button variant="outline" size="sm" type="submit">
              {onboardingSectionConfig.showActionLabel}
            </Button>
          </form>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="ring-0 shadow-none border border-dashed rounded-sm bg-card/10">
      <CardHeader className="gap-3 border-b border-dashed">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/20 text-primary">
                {onboardingSectionConfig.badgeLabel}
              </Badge>
              <Badge variant="secondary">
                {snapshot.completedCount}/{snapshot.totalSteps} complete
              </Badge>
            </div>
            <div className="space-y-1">
              <CardTitle>{onboardingSectionConfig.title}</CardTitle>
              <CardDescription>
                {onboardingSectionConfig.description}
              </CardDescription>
            </div>
          </div>

          <form action={dismissOnboardingAction}>
            <Button variant="ghost" size="sm" type="submit">
              <XIcon className="size-4" />
              {onboardingSectionConfig.hideActionLabel}
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="h-1.5 min-w-28 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${snapshot.progress}%` }}
            />
          </div>
          <span>
            {nextStep ? `Next: ${nextStep.title}` : "Checklist complete"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-1">
        {openSteps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-border/70 bg-background/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
            )}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border",
                  "border-primary/15 bg-primary/10 text-primary",
                )}
              >
                <step.icon className="size-4" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{step.title}</h3>
                  <Badge variant="secondary">Open</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              {step.href && step.ctaLabel ? (
                <Button asChild size="sm" variant="secondary">
                  <Link href={step.href}>
                    {step.ctaLabel}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        ))}

        {completedSteps.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-dashed pt-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Done</span>
            {completedSteps.map((step) => (
              <Badge key={step.id} variant="outline" className="gap-1">
                <CheckCircle2Icon className="size-3 text-primary" />
                {step.title}
              </Badge>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}