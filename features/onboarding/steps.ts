import { dashboardConfig } from "@/config";

export const onboardingSectionConfig = dashboardConfig.onboarding;
export const onboardingSteps = onboardingSectionConfig.steps;

export type OnboardingStep = (typeof onboardingSteps)[number];
export type OnboardingStepId = OnboardingStep["id"];