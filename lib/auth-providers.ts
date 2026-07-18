import "server-only";

import { authConfig } from "@/config";
import { z } from "zod";

export type AuthProvider = (typeof authConfig.auth.providers)[number];

type ProviderSecrets = {
  clientId: string;
  clientSecret: string;
};

const providerSecretsSchema = z.object({
  clientId: z.string().trim().min(1),
  clientSecret: z.string().trim().min(1),
});

function getProviderEnv(provider: AuthProvider): { clientId?: string; clientSecret?: string } {
  switch (provider) {
    case "github":
      return {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      };
    case "google":
      return {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      };
    case "discord":
      return {
        clientId: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
      };
    default:
      return {};
  }
}

function parseProviderSecrets(provider: AuthProvider): ProviderSecrets | null {
  const parsed = providerSecretsSchema.safeParse(getProviderEnv(provider));
  return parsed.success ? parsed.data : null;
}

export function getEnabledAuthProviders(): AuthProvider[] {
  return authConfig.auth.providers.filter((provider) => {
    return parseProviderSecrets(provider) !== null;
  });
}

export function getEnabledSocialProvidersConfig(): Partial<
  Record<AuthProvider, ProviderSecrets>
> {
  return authConfig.auth.providers.reduce(
    (acc, provider) => {
      const secrets = parseProviderSecrets(provider);
      if (secrets) {
        acc[provider] = secrets;
      }
      return acc;
    },
    {} as Partial<Record<AuthProvider, ProviderSecrets>>,
  );
}
