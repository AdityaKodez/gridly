import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

// Plans (Polar product mapping)
export type Plan = {
  name: string;
  description: string;
  price: number; // monthly price in USD, 0 = free
  billingPeriod: "month" | "one_time";
  slug: string;
  productId?: string; // Polar product ID
  href?: string; // Optional URL to redirect to instead of checkout (for free/open-source)
  features: string[];
  cta: string;
  highlighted?: boolean; // "Most popular" badge
};

// ─── Dashboard ───────────────────────────────────────
export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type OnboardingContextRoute = "/dashboard" | "/ai" | "/settings";

export type OnboardingStepId =
  | "learn-layout"
  | "try-ai-chat"
  | "review-settings";

export type OnboardingStepConfig = {
  id: OnboardingStepId;
  title: string;
  description: string;
  hint: string;
  href?: string;
  ctaLabel?: string;
  icon: LucideIcon;
  contextRoute: OnboardingContextRoute;
};

export type DashboardOnboardingConfig = {
  enabled: boolean;
  badgeLabel: string;
  title: string;
  description: string;
  hiddenTitle: string;
  hiddenDescription: string;
  hideActionLabel: string;
  showActionLabel: string;
  steps: readonly OnboardingStepConfig[];
};

export type DashboardConfig = {
  sidebar: {
    width: string;
    widthIcon: string;
  };
  nav: NavItem[];
  onboarding: DashboardOnboardingConfig;
};

// ─── Landing Page ────────────────────────────────────
export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
};

export type TechStackItem = {
  icon: ComponentType<{ size: string }>;
  title: string;
  description: string;
};

// Used by the optional Highlights.tsx zigzag layout (alternative to FeatureShowcase).
export type Highlight = {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
};

export type ComparisonRow = {
  feature: string;
  values: [boolean | string, boolean | string, ...(boolean | string)[]];
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type LegalSection = {
  title: string;
  body: string[];
};

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};
