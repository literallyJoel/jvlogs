import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
export const logsRouter = createTRPCRouter({
  getLogs: publicProcedure
    .input(
      z.object({
        appId: z.string(),
        logLevel: z.enum(["error", "warning", "debug", "info", ""]).default(""),
        limit: z.number().default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const whereClause =
        input.logLevel !== ""
          ? { type: input.logLevel, appId: input.appId }
          : { appId: input.appId };
      return ctx.db.jvlogs_logs.findMany({
        where: whereClause,
        orderBy: { date: "asc" },
        take: input.limit,
      });
    }),

  createLog: publicProcedure
    .input(
      z.object({
        log: z.object({
          date: z.string(),
          type: z.string(),
          route: z.string(),
          message: z.string(),
        }),
        appId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.jvlogs_logs.create({
        data: {
          date: input.log.date,
          type: input.log.type,
          route: input.log.route,
          message: input.log.message,
          appId: input.appId,
        },
      });
    }),

  deleteLog: publicProcedure
    .input(z.object({ logId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.jvlogs_logs.delete({
        where: {
          id: input.logId,
        },
      });
    }),
});
