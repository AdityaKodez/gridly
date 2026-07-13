import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { polar, checkout, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { z } from "zod";
import prisma from "./db";
import { plansConfig } from "@/config";
import { getEnabledSocialProvidersConfig } from "./auth-providers";
import { applyOrderPaidEntitlement } from "./billing";

const authEnvSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .trim()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url(),
  // Polar is optional — the app runs fine without payments configured.
  POLAR_ACCESS_TOKEN: z.string().trim().min(1).optional(),
  POLAR_SUCCESS_URL: z.string().url().optional(),
  POLAR_WEBHOOK_SECRET: z.string().trim().min(1).optional(),
});

const authEnv = authEnvSchema.parse(process.env);
const socialProviders = getEnabledSocialProvidersConfig();

// Only wire up Polar when all three env vars are present.
const hasPolar =
  authEnv.POLAR_ACCESS_TOKEN &&
  authEnv.POLAR_SUCCESS_URL &&
  authEnv.POLAR_WEBHOOK_SECRET;

function buildPolarPlugin() {
  if (!hasPolar) return [];

  const polarClient = new Polar({
    accessToken: authEnv.POLAR_ACCESS_TOKEN!,
    server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
  });

  return [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: plansConfig.flatMap((plan) =>
            plan.productId
              ? [{ productId: plan.productId, slug: plan.slug }]
              : [],
          ),
          successUrl: authEnv.POLAR_SUCCESS_URL!,
          authenticatedUsersOnly: true,
        }),
        webhooks({
          secret: authEnv.POLAR_WEBHOOK_SECRET!,
          onOrderPaid: async (payload) => {
            try {
              await applyOrderPaidEntitlement(payload);
            } catch (error) {
              console.error("[Polar] Failed to apply order entitlement", error);
              throw error;
            }
          },
        }),
      ],
    }),
  ];
}

export const auth = betterAuth({
  baseURL: authEnv.BETTER_AUTH_URL,
  trustedOrigins: [authEnv.BETTER_AUTH_URL],
  secret: authEnv.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    debugLogs: process.env.NODE_ENV !== "production",
  }),
  socialProviders,
  plugins: [...buildPolarPlugin()],
});
