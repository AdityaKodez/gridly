import arcjet, {
  detectBot,
  shield,
  type ArcjetDecision,
} from "@arcjet/next";
import { appConfig } from "@/config";

const arcjetConfig = appConfig.arcjet;
const arcjetKey = process.env.ARCJET_KEY?.trim();

type ArcjetRules = Parameters<ReturnType<typeof arcjet>["withRule"]>[0];

function shouldEnableArcjet() {
  if (!arcjetConfig.enabled) return false;

  if (arcjetKey) return true;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ARCJET_KEY is required when appConfig.arcjet.enabled=true in production",
    );
  }

  console.warn(
    "[Arcjet] ARCJET_KEY missing; protection disabled in non-production.",
  );
  return false;
}

export const aj = shouldEnableArcjet()
  ? arcjet({
      key: arcjetKey!,
      rules: [
        ...(arcjetConfig.shield.enabled
          ? [shield({ mode: arcjetConfig.shield.mode })]
          : []),

        ...(arcjetConfig.botProtection.enabled
          ? [
              detectBot({
                mode: arcjetConfig.botProtection.mode,
                allow: [...arcjetConfig.botProtection.allow],
              }),
            ]
          : []),
      ],
    })
  : null;

export async function protectWithRules(
  request: Request,
  rules: ArcjetRules = [],
): Promise<ArcjetDecision | null> {
  if (!aj) return null;

  const instance = rules.length > 0 ? aj.withRule(rules) : aj;
  return instance.protect(request);
}
