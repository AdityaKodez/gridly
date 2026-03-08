"use server";

import { revalidatePath } from "next/cache";

import { dashboardConfig } from "@/config";
import { requireAuth } from "@/lib/auth-utils";
import {
  completeOnboardingStep,
  dismissOnboarding,
  resumeOnboarding,
} from "@/lib/onboarding";
import type { OnboardingStepId } from "./steps";

const onboardingPath = "/dashboard";

function revalidateOnboardingPaths() {
  revalidatePath(onboardingPath);
}

export async function dismissOnboardingAction() {
  if (!dashboardConfig.onboarding.enabled) {
    return;
  }

  const session = await requireAuth();
  await dismissOnboarding(session.user.id);
  revalidateOnboardingPaths();
}

export async function resumeOnboardingAction() {
  if (!dashboardConfig.onboarding.enabled) {
    return;
  }

  const session = await requireAuth();
  await resumeOnboarding(session.user.id);
  revalidateOnboardingPaths();
}

export async function completeOnboardingStepByIdAction(
  stepId: OnboardingStepId,
) {
  if (!dashboardConfig.onboarding.enabled) {
    return;
  }

  const session = await requireAuth();
  await completeOnboardingStep(session.user.id, stepId);
  revalidateOnboardingPaths();
}