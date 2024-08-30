import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { projects } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
	//Todo handle steps in next form
	create: protectedProcedure
		.input(
			z.object({
				projectName: z.string().min(3),
				projectDescription: z.string(),
				category: z.string(),
				projectImage: z.string().optional(),
			}),
		) //Handle some kind of return or error if needed
		.mutation(async ({ ctx, input }) => {
			const project = await ctx.db
				.insert(projects)
				.values({
					id: crypto.randomUUID(),
					projectName: input.projectName,
					created_by: ctx.session.user.id,
					likes: 0,
					makes: 0,
					projectDescription: input.projectDescription,
					category: "Coding",
					projectImage: input.projectImage ?? undefined,
					createdAt: new Date(Date.now()),
				})
				.returning({ insertedId: projects.id });
			return project[0];
		}),
	getUserProjects: protectedProcedure.query(async ({ ctx }) => {
		const projectList = await ctx.db.query.projects.findMany({
			where: eq(projects.created_by, ctx?.session?.user.id ?? ""),
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		});
		return projectList ?? new TRPCError({ code: "NOT_FOUND" });
	}),
	getProjectById: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
			}),
		)
		.query(async ({ ctx, input }) => {
			const project = await ctx.db.query.projects.findFirst({
				where: eq(projects.id, input.projectId),
			});
			return project ?? new TRPCError({ code: "NOT_FOUND" });
		}),
	getLatestProjects: publicProcedure
		.input(
			z.object({
				limit: z.number().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const project = await ctx.db.query.projects.findMany({
				orderBy: (projects, { desc }) => [desc(projects.createdAt)],
				limit: input.limit ?? 10,
			});
			return project ?? new TRPCError({ code: "NOT_FOUND" });
		}),
	getProjectsByCategory: publicProcedure
		.input(
			z.object({
				category: z.string().min(3),
			}),
		)
		.query(async ({ ctx, input }) => {
			const project = await ctx.db.query.projects.findMany({
				where: eq(projects.category, input.category.toLowerCase()),
				orderBy: (projects, { desc }) => [desc(projects.createdAt)],
				limit: 50,
			});
			return project ?? new TRPCError({ code: "NOT_FOUND" });
		}),
	setProjectName: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
				projectName: z.string().min(3),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const res = await ctx.db
				.update(projects)
				.set({
					projectName: input.projectName,
				})
				.where(eq(projects.id, input.projectId));
			return res;
			// if(res.rowsAffected === 0) {
			// 	return false;
			// }
			// return  true;
		}),
});
