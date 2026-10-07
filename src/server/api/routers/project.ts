import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1, "Project title is required"),
                description: z.string().optional(),
                orgId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.project.create({
                data: {
                    title: input.title,
                    description: input.description,
                    orgId: input.orgId
                }
            })
        }),
    getAll: publicProcedure
        .query( async({ ctx }) => {
            return ctx.db.project.findMany({
                include: {tasks: true}
            })
        })
})