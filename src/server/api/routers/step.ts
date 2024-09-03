import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { env } from "~/env";
import { Ratelimit } from "@unkey/ratelimit";
import { steps } from "~/server/db/schema";
import { projects } from "~/server/db/schema";

export const stepsRouter = createTRPCRouter({
	//Todo handle steps in next form
	create: protectedProcedure
		.input(
			z.object({
				title: z.string().min(3),
				projectId: z.string(),
				description: z.string(),
				stepNumber: z.number(),
                image: z.string().optional(),
			}),
		) //Handle some kind of return or error if needed
		.mutation(async ({ ctx, input }) => {
			const unkey = new Ratelimit({
				rootKey: env.UNKEY_ROOT_KEY,
				namespace: "steps.create",
				limit: 3,
				duration: "5s",
			});
			const { success } = await unkey.limit(ctx.session.user.id);
			if (!success) {
				return new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			const step = await ctx.db.insert(steps).values({
				id: crypto.randomUUID(),
                title: input.title,
                projectId: input.projectId,
				description: input.description,
				stepImage: input.image ?? undefined,
				stepNumber: input.stepNumber,
				createdAt: new Date(Date.now()),
			}).returning({insertedId: steps.id}).then(async (res) =>{
				if (res[0]?.insertedId) {
					const project = await ctx.db.update(projects).set({steps: sql`(json_array_append(steps, ${res[0].insertedId}))`}).where(eq(projects.id, input.projectId)).returning({steps: projects.steps});
				}
				return res;	
			})
		}),
		getStepByProjectId: publicProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
			}),
		).query(async ({ ctx, input }) => {
			const stepList = await ctx.db.query.steps.findMany({
				where: eq(steps.projectId, input.projectId),
				orderBy: (steps, { desc }) => [desc(steps.stepNumber)]
			});
			return stepList ?? new TRPCError({ code: "NOT_FOUND" });
		}),
		editStep: protectedProcedure
		.input(
			z.object({
				stepId: z.string().min(3),
				stepTitle: z.string().min(3),
				stepDescription: z.string().min(3),
			}),
		).mutation(async ({ ctx, input }) => {
			const res = await ctx.db
				.update(steps)
				.set({
					title: input.stepTitle,
					description: input.stepDescription,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(steps.id, input.stepId));
			return res.rowsAffected === 1
				? true
				: new TRPCError({ code: "NOT_FOUND" });
		}),
		editStepImage: protectedProcedure
		.input(
			z.object({
				stepId: z.string().min(3),
				image: z.string().optional(),
			}),
		).mutation(async ({ ctx, input }) => {
			const res = await ctx.db
				.update(steps)
				.set({
					stepImage: input.image,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(steps.id, input.stepId));
			return res.rowsAffected === 1
				? true
				: new TRPCError({ code: "NOT_FOUND" });
		}),
});
