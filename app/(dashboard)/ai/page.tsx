import { DashboardHeader } from "@/features/dashboard/dashboard-header";
import { Chat } from "@/features/ai/chat";
import { OnboardingAutoStep } from "@/features/onboarding/auto-step";
import { dashboardConfig } from "@/config";

export default function AIPage() {
  return (
    <>
      <DashboardHeader title="AI Chat" />
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {dashboardConfig.onboarding.enabled ? (
          <OnboardingAutoStep stepId="try-ai-chat" />
        ) : null}
        <Chat />
      </div>
    </>
  );
}
