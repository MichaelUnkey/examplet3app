import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { steps } from "~/server/db/schema";
import { UnkeyRatelimit } from "~/server/ratelimit";

export const stepsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3),
        projectId: z.string(),
        description: z.string(),
        stepNumber: z.number(),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "steps.create",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const step = await ctx.db
        .insert(steps)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          projectId: input.projectId,
          description: input.description,
          stepImage: input.image ?? undefined,
          stepNumber: input.stepNumber,
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        })
        .returning({ insertedId: steps.id })
        // .then(async (res) => {
        //   if (res[0]?.insertedId) {
        //     const project = await ctx.db
        //       .update(projects)
        //       .set({
        //         steps: sql`(json_array_append(steps, ${res[0].insertedId}))`,
        //       })
        //       .where(eq(projects.id, input.projectId))
        //       .returning({ steps: projects.steps });
        //   }
          if (!step) {
            throw new TRPCError({
              message: "Error inserting into DB",
              code: "BAD_REQUEST",
            });
          }
          return step;
    
    }),
  getStepByProjectId: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(3),
      }),
    )
    .query(async ({ ctx, input }) => {
      const stepList = await ctx.db.query.steps.findMany({
        where: eq(steps.projectId, input.projectId),
        with: { project: true },
        orderBy: (steps, { desc }) => [desc(steps.stepNumber)],
      });
      if(!stepList) {
        throw new TRPCError({ message: "Error fetching steps",
          code: "NOT_FOUND" });
      }
      return stepList;
    }),
  editStep: protectedProcedure
    .input(
      z.object({
        stepId: z.string().min(3),
        stepTitle: z.string().min(3),
        stepDescription: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "steps.edit",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(steps)
        .set({
          title: input.stepTitle,
          description: input.stepDescription,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(steps.id, input.stepId));
        if(!res.rowsAffected) {
          throw new TRPCError({ message: "Error editing step",
            code: "BAD_REQUEST" });
        }
      return res.rowsAffected === 1;
    }),
  editStepImage: protectedProcedure
    .input(
      z.object({
        stepId: z.string().min(3),
        image: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "steps.edit.image",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(steps)
        .set({
          stepImage: input.image,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(steps.id, input.stepId));
        if(!res.rowsAffected) {
          throw new TRPCError({ message: "Error editing step image",
            code: "BAD_REQUEST" });
        }
      return res.rowsAffected === 1;
    }),
});
