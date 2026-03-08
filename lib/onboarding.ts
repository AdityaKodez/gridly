import "server-only";

import prisma from "@/lib/db";
import {
  onboardingSteps,
  type OnboardingStep,
  type OnboardingStepId,
} from "@/features/onboarding/steps";

const onboardingStepIds = new Set<OnboardingStepId>(
  onboardingSteps.map((step) => step.id),
);

const onboardingRecordSelect = {
  completedStepIds: true,
  dismissedAt: true,
} as const;

type UserOnboardingRecord = {
  completedStepIds: string[];
  dismissedAt: Date | null;
};

export type OnboardingStepState = OnboardingStep & {
  completed: boolean;
};

export type OnboardingSnapshot = {
  steps: OnboardingStepState[];
  completedCount: number;
  totalSteps: number;
  progress: number;
  dismissed: boolean;
  allComplete: boolean;
};

function normalizeOnboardingRecord(
  record: UserOnboardingRecord | null,
): UserOnboardingRecord {
  return {
    completedStepIds: record?.completedStepIds ?? [],
    dismissedAt: record?.dismissedAt ?? null,
  };
}

function getCompletedStepSet(record: UserOnboardingRecord) {
  return new Set<OnboardingStepId>(
    record.completedStepIds.filter((stepId): stepId is OnboardingStepId =>
      onboardingStepIds.has(stepId as OnboardingStepId),
    ),
  );
}

function buildOnboardingSnapshot(record: UserOnboardingRecord): OnboardingSnapshot {
  const completedStepIds = getCompletedStepSet(record);
  const steps = onboardingSteps.map((step) => ({
    ...step,
    completed: completedStepIds.has(step.id),
  }));
  const completedCount = steps.filter((step) => step.completed).length;
  const totalSteps = steps.length;
  const progress = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

  return {
    steps,
    completedCount,
    totalSteps,
    progress,
    dismissed: Boolean(record.dismissedAt),
    allComplete: completedCount === totalSteps,
  };
}

async function ensureOnboardingRecord(userId: string) {
  return prisma.userOnboarding.upsert({
    where: { userId },
    update: {},
    create: { userId },
    select: onboardingRecordSelect,
  });
}

export async function getOnboardingSnapshot(
  userId: string,
): Promise<OnboardingSnapshot> {
  const record = normalizeOnboardingRecord(
    await prisma.userOnboarding.findUnique({
      where: { userId },
      select: onboardingRecordSelect,
    }),
  );

  return buildOnboardingSnapshot(record);
}

export async function completeOnboardingStep(
  userId: string,
  stepId: OnboardingStepId,
) {
  if (!onboardingStepIds.has(stepId)) {
    throw new Error(`Unknown onboarding step: ${stepId}`);
  }

  const record = normalizeOnboardingRecord(await ensureOnboardingRecord(userId));
  const completedStepIds = getCompletedStepSet(record);
  if (completedStepIds.has(stepId)) {
    return record;
  }

  completedStepIds.add(stepId);

  return prisma.userOnboarding.update({
    where: { userId },
    data: {
      completedStepIds: Array.from(completedStepIds),
    },
    select: onboardingRecordSelect,
  });
}

export async function getDashboardOnboardingSnapshot(
  userId: string,
): Promise<OnboardingSnapshot> {
  const record = normalizeOnboardingRecord(
    await completeOnboardingStep(userId, "learn-layout"),
  );

  return buildOnboardingSnapshot(record);
}

export async function dismissOnboarding(userId: string) {
  await prisma.userOnboarding.upsert({
    where: { userId },
    update: { dismissedAt: new Date() },
    create: {
      userId,
      dismissedAt: new Date(),
    },
  });
}

export async function resumeOnboarding(userId: string) {
  await prisma.userOnboarding.upsert({
    where: { userId },
    update: { dismissedAt: null },
    create: { userId },
  });
}