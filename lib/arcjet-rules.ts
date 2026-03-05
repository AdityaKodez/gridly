import { fixedWindow } from "@arcjet/next";
import { appConfig } from "@/config";

const { rateLimit } = appConfig.arcjet;

export const apiRules = rateLimit.api.enabled
  ? fixedWindow({
      mode: rateLimit.api.mode,
      max: rateLimit.api.max,
      window: rateLimit.api.window,
    })
  : [];

export const authRules = rateLimit.auth.enabled
  ? fixedWindow({
      mode: rateLimit.auth.mode,
      max: rateLimit.auth.max,
      window: rateLimit.auth.window,
    })
  : [];

export const aiRules = rateLimit.ai.enabled
  ? fixedWindow({
      mode: rateLimit.ai.mode,
      max: rateLimit.ai.max,
      window: rateLimit.ai.window,
    })
  : [];
