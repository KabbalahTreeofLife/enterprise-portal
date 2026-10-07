import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                email: z.string().email("Invalid email address"),
                password: z.string().min(6, "Password must be at least 6 characters long")
            })
        )
        .mutation(async ({ ctx, input }) => {
            const existingUser = await ctx.db.user.findUnique({
                where: {email: input.email}
            })

            if (existingUser) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "An account with this email already exists."
                })
            }

            const hashedPassword = await bcrypt.hash(input.password, 10);

            const user = await ctx.db.user.create({
                data: {
                    name: input.name,
                    email: input.email,
                    password: hashedPassword
                }
            });

            return { success: true, userId: user.id };
        })
})