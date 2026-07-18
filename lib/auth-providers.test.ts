import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert";
import { getEnabledSocialProvidersConfig, getEnabledAuthProviders } from "./auth-providers";

describe("auth-providers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return empty config when no provider secrets are present", () => {
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    delete process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_SECRET;
    delete process.env.DISCORD_CLIENT_ID;
    delete process.env.DISCORD_CLIENT_SECRET;

    const config = getEnabledSocialProvidersConfig();
    assert.deepEqual(config, {});

    const providers = getEnabledAuthProviders();
    assert.deepEqual(providers, []);
  });

  it("should return GitHub config when GitHub secrets are present", () => {
    process.env.GITHUB_CLIENT_ID = "gh-id";
    process.env.GITHUB_CLIENT_SECRET = "gh-secret";

    const config = getEnabledSocialProvidersConfig();
    assert.deepEqual(config, {
      github: { clientId: "gh-id", clientSecret: "gh-secret" }
    });

    const providers = getEnabledAuthProviders();
    assert.deepEqual(providers, ["github"]);
  });

  it("should ignore provider if secrets are empty strings", () => {
    process.env.GOOGLE_CLIENT_ID = "   ";
    process.env.GOOGLE_CLIENT_SECRET = "";

    const config = getEnabledSocialProvidersConfig();
    assert.deepEqual(config, {});

    const providers = getEnabledAuthProviders();
    assert.deepEqual(providers, []);
  });

  it("should return multiple configs when multiple providers are enabled", () => {
    process.env.GITHUB_CLIENT_ID = "gh-id";
    process.env.GITHUB_CLIENT_SECRET = "gh-secret";
    process.env.DISCORD_CLIENT_ID = "discord-id";
    process.env.DISCORD_CLIENT_SECRET = "discord-secret";

    const config = getEnabledSocialProvidersConfig();
    assert.deepEqual(config, {
      github: { clientId: "gh-id", clientSecret: "gh-secret" },
      discord: { clientId: "discord-id", clientSecret: "discord-secret" }
    });

    const providers = getEnabledAuthProviders();
    assert.deepEqual(providers, ["github", "discord"]);
  });
});
