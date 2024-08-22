import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { projects } from "~/server/db/schema";

export const projectRouter = createTRPCRouter({
 
  create: protectedProcedure
    .input(z.object({
      projectName: z.string().min(3),
      projectDescription: z.string(),
      category: z.enum(["Art", "Cosplay", "Coding", "Robotics", "Electronics", "Tools", "Woodworking", "Mechanical", "Other"]),
      // projectImage: 
      // steps: z.array(z.string()),
      created_by: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      console.log("Working ");
      
      await ctx.db.insert(projects).values({
        id: crypto.randomUUID(),
        projectName: input.projectName,
        created_by: ctx.session.user.id,
        likes: 0,
        makes: 0,
        projectDescription: input.projectDescription,
        category: input.category,
        // projectImage: input.projectImage,
        // steps: [],
        createdAt: new Date(Date.now()),
      })
    }),
});