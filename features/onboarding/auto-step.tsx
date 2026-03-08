"use client";

import { startTransition, useEffect, useRef } from "react";

import { completeOnboardingStepByIdAction } from "./actions";
import type { OnboardingStepId } from "./steps";

export function OnboardingAutoStep({
  stepId,
}: {
  stepId: OnboardingStepId;
}) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) {
      return;
    }

    hasRunRef.current = true;

    startTransition(() => {
      void completeOnboardingStepByIdAction(stepId);
    });
  }, [stepId]);

  return null;
}