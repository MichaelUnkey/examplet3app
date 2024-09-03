import { eq } from "drizzle-orm";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { projects } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { UnkeyRatelimit } from "~/server/ratelimit";
import { Ratelimit } from "@unkey/ratelimit";
import { env } from "~/env";
 
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
			// const unkey =  new Ratelimit({
			// 	rootKey: env.UNKEY_ROOT_KEY,
			// 	namespace: "project.create",
			// 	limit: 1,
			// 	duration: "100000000s",
			//   });
			//   const { success } = await unkey.limit(ctx.session.user.id);
			//   console.log(success);
			  
			//   if (!success) {
			// 	  return new Error("TOO_MANY_REQUESTS");
			//   }
			const project = await ctx.db
				.insert(projects)
				.values({
					id: crypto.randomUUID(),
					projectName: input.projectName,
					created_by: ctx.session.user.id,
					created_byName: ctx.session.user.name,
					likes: 0,
					makes: 0,
					projectDescription: input.projectDescription,
					category: input.category.toUpperCase(),
					projectImage: input.projectImage ?? undefined,
					createdAt: new Date(Date.now()),
				})
				.returning({ insertedId: projects.id });
			return project[0];
		}),
	getUserProjects: protectedProcedure.query(async ({ ctx }) => {
		const unkey = UnkeyRatelimit({
			namespace: "project.get.userProjects",
			limit: 3,
			duration: 5,
			userId: ctx.session.user.id,
		});
		if (!unkey) {
			return new TRPCError({ code: "TOO_MANY_REQUESTS" });
		}
		const projectList = await ctx.db.query.projects.findMany({
			where: eq(projects.created_by, ctx?.session?.user.id ?? ""),
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		});
		return projectList ?? new TRPCError({ code: "NOT_FOUND" });
	}),
	getProjectById: publicProcedure
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
				where: eq(projects.category, input.category.toUpperCase()),
				orderBy: (projects, { desc }) => [desc(projects.createdAt)],
				limit: 50,
			});
			return project ?? new TRPCError({ code: "NOT_FOUND" });
		}),
	editProjectName: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
				projectName: z.string().min(3),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const unkey = UnkeyRatelimit({
				namespace: "project.edit.projectName",
				limit: 3,
				duration: 5,
				userId: ctx.session.user.id,
			});
			if (!unkey) {
				return new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			const res = await ctx.db
				.update(projects)
				.set({
					projectName: input.projectName,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(projects.id, input.projectId));
			return res;

		}),
	editProjectImage: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
				image: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const unkey = UnkeyRatelimit({
				namespace: "project.edit.projectImage",
				limit: 3,
				duration: 5,
				userId: ctx.session.user.id,
			});
			if (!unkey) {
				return new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			const res = await ctx.db
				.update(projects)
				.set({
					projectImage: input.image,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(projects.id, input.projectId));
			return res.rowsAffected === 1
				? true
				: new TRPCError({ code: "NOT_FOUND" });
		}),
	editProjectCategory: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
				category: z.string().min(3),
			}),
		)
		.mutation(async ({ ctx, input }) => {
		
			const unkey = UnkeyRatelimit({
				namespace: "project.edit.projectCategory",
				limit: 1,
				duration: 1000000000,
				userId: ctx.session.user.id,
			});
			if (!unkey) {
				return new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			const res = await ctx.db
				.update(projects)
				.set({
					category: input.category,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(projects.id, input.projectId));
			return res.rowsAffected === 1
				? true
				: new TRPCError({ code: "NOT_FOUND" });
		}),
	editProjectDescription: protectedProcedure
		.input(
			z.object({
				projectId: z.string().min(3),
				projectDescription: z.string().min(3),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const unkey = UnkeyRatelimit({
				namespace: "project.edit.projectDescription",
				limit: 3,
				duration: 5,
				userId: ctx.session.user.id,
			});
			if (!unkey) {
				return new TRPCError({ code: "TOO_MANY_REQUESTS" });
			}
			const res = await ctx.db
				.update(projects)
				.set({
					projectDescription: input.projectDescription,
					updatedAt: new Date(Date.now()),
				})
				.where(eq(projects.id, input.projectId));
			return res.rowsAffected === 1
				? true
				: new TRPCError({ code: "NOT_FOUND" });
		}),
});
