import { z } from 'zod';

export const StepSchema = z.object({
    id: z.string(),
    title: z.string().min(3),
    stepNumber: z.number(),
    projectId: z.string(),
    description: z.string(),
    stepImage: z.string().optional(),
    createdAt: z.number(),
    updatedAt: z.number().optional(),
});

export const ProjectSchema = z.object({
    id: z.string(),
    projectName: z.string(),
    created_by: z.string(),
    created_byName: z.string(),
    projectDescription: z.string(),
    category: z.string(),
    projectImage: z.string().optional(),
    createdAt: z.number().positive(),
    updatedAt: z.number().positive().optional(),
});


export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.number(),
    image: z.string().optional(),
});
