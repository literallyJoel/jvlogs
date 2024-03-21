import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";


export const appsRouter = createTRPCRouter({
  getApps: publicProcedure
    .input(
      z.object({
        appId: z.string().default(""),
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
        const whereClause = input.appId ? { id: input.appId } : {};
      return ctx.db.jvlogs_apps.findMany({
        where: whereClause,
        take: input.limit,
      });
    }),
   createApp: publicProcedure
    .input(z.object({appName: z.string().min(3)}))
    .mutation(async ({ctx, input}) => {
        return ctx.db.jvlogs_apps.create({
            data: {
                name: input.appName
            }
        });
    }),
});
