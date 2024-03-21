import { logsRouter } from "@/server/api/routers/logs";
import { createCallerFactory, createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { appsRouter } from "./routers/apps";
import { generateOpenApiDocument } from "trpc-openapi";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  logs: logsRouter,
  apps: appsRouter,
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "JVLogs API",
  version: "1.0.0",
  baseUrl: "http://localhost:5173",
});
// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

