import "server-only";

import {
  convertToModelMessages,
  safeValidateUIMessages,
  stepCountIs,
  streamText,
  tool,
} from "ai";
import { headers } from "next/headers";
import { z } from "zod";
import { aiModel, isAIConfigured, systemPrompt } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { protectWithRules } from "@/lib/arcjet";
import { aiRules } from "@/lib/arcjet-rules";

export const dynamic = "force-dynamic";

const chatRequestBodySchema = z.object({
  messages: z.unknown(),
});

function extractStatusCode(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  return null;
}

function toClientErrorMessage(error: unknown): string {
  const statusCode = extractStatusCode(error);

  if (statusCode === 429) {
    return "Rate limit reached. Please wait a moment and try again.";
  }

  if (statusCode === 401 || statusCode === 403) {
    return "Your session is no longer valid. Please sign in again.";
  }

  return "The AI request failed. Please try again.";
}

export async function POST(req: Request) {
  const decision = await protectWithRules(req, aiRules);
  if (decision?.isDenied()) {
    return new Response("Too many requests", { status: 429 });
  }

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!isAIConfigured) {
    return Response.json(
      {
        error:
          "GOOGLE_GENERATIVE_AI_API_KEY is not configured. Add it to your environment and restart the server.",
      },
      { status: 503 },
    );
  }

  let requestBody: z.infer<typeof chatRequestBodySchema>;
  try {
    const json = await req.json();
    const parsed = chatRequestBodySchema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }
    requestBody = parsed.data;
  } catch (error) {
    console.error("[AI Chat] Failed to parse request JSON", error);
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validatedMessages = await safeValidateUIMessages({
    messages: requestBody.messages,
  });
  if (!validatedMessages.success) {
    return Response.json(
      { error: "Invalid message format." },
      { status: 400 },
    );
  }

  try {
    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      messages: await convertToModelMessages(validatedMessages.data),
      stopWhen: stepCountIs(5),
      tools: {
        getUserInfo: tool({
          description:
            "Get information about the currently signed-in user, such as their name, email, and plan.",
          inputSchema: z.object({}),
          execute: async () => {
            return {
              name: session.user.name,
              email: session.user.email,
              id: session.user.id,
            };
          },
        }),
        getCurrentTime: tool({
          description: "Get the current date and time.",
          inputSchema: z.object({}),
          execute: async () => {
            return {
              datetime: new Date().toISOString(),
              date: new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              time: new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };
          },
        }),
      },
      onError: (error) => {
        console.error("[AI Chat] streamText error:", error);
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("[AI Chat] Stream response error:", error);
        return toClientErrorMessage(error);
      },
    });
  } catch (error) {
    console.error("[AI Chat] Route error:", error);
    const statusCode = extractStatusCode(error) ?? 500;
    return Response.json({ error: toClientErrorMessage(error) }, { status: statusCode });
  }
}
