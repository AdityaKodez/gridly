import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { protectWithRules } from "@/lib/arcjet";
import { apiRules } from "@/lib/arcjet-rules";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";

const handler = async (req: Request) => {
  const decision = await protectWithRules(req, apiRules);

  if (decision?.isDenied()) {
    return new Response("Too many requests", { status: 429 });
  }

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : ({ path, error }) => {
            console.error(`tRPC error on ${path ?? "<no-path>"}`, {
              code: error.code,
              message: error.message,
            });
          },
  });
};

export { handler as GET, handler as POST };
