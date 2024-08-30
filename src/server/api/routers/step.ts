import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";
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
		getStepByProjectId: protectedProcedure
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
		})
});
