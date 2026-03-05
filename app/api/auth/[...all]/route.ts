import { auth } from "@/lib/auth";
import { protectWithRules } from "@/lib/arcjet";
import { authRules } from "@/lib/arcjet-rules";
import { toNextJsHandler } from "better-auth/next-js";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth);

export const GET = authGet;

export async function POST(req: Request) {
  const decision = await protectWithRules(req, authRules);

  if (decision?.isDenied()) {
    return new Response("Too many requests", { status: 429 });
  }

  return authPost(req);
}
