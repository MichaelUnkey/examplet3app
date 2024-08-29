import { z } from 'zod';

export type ProjectSchema = {
    id: string,
    projectName: string,
    created_by: string
    likes: number | null,
    makes: number
    projectDescription: string,
    category: string,
    projectImage: string | null,
    steps: string[],
    createdAt: Date,
    updatedAt: Date | null,
};

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

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.number(),
    image: z.string().optional(),
});
