import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
} from "~/server/api/trpc";
import { steps } from "~/server/db/schema";

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
			}).returning({insertedId: steps.id});
            return step[0];
		}),
	
});
