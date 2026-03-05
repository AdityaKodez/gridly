import arcjet, {
  detectBot,
  shield,
  type ArcjetDecision,
} from "@arcjet/next";
import { appConfig } from "@/config";

const arcjetConfig = appConfig.arcjet;
const arcjetKey = process.env.ARCJET_KEY?.trim();

type ArcjetRules = Parameters<ReturnType<typeof arcjet>["withRule"]>[0];

let hasWarnedMissingKey = false;

function shouldEnableArcjet() {
  if (!arcjetConfig.enabled) return false;
  if (arcjetKey) return true;

  if (!hasWarnedMissingKey) {
    hasWarnedMissingKey = true;
    console.warn(
      "[Arcjet] ARCJET_KEY is missing; Arcjet protection is disabled. Set ARCJET_KEY or turn off appConfig.arcjet.enabled.",
    );
  }

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
