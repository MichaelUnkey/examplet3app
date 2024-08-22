"use client";

import React, { EventHandler, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/app/components/ui/button";
import { promises as fs } from "node:fs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/app/components/ui/form";
import { Input } from "~/app/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { api } from "~/trpc/react";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";
import { Label } from "./ui/label";
import { Categories } from "../categories";
import { Session } from "next-auth";
type Category =
  | "Art"
  | "Cosplay"
  | "Coding"
  | "Robotics"
  | "Electronics"
  | "Tools"
  | "Woodworking"
  | "Mechanical"
  | "Other";

type Steps = {
  title: string;
  content: string;
  images: Blob[] | undefined;
}[];
type FormData = {
  projectName: string;
  category: Category;
  projectDescription: string;
  projectImage: Blob[];
  // steps: Steps;
};
const CATEGORYS = [
  "Art",
  "Cosplay",
  "Coding",
  "Robotics",
  "Electronics",
  "Tools",
  "Woodworking",
  "Mechanical",
  "Other",
];
const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const formSchema = z.object({
  projectName: z.string().min(2).max(50),
  category: z.string().min(2).max(50),
  projectDescription: z.string().min(2).max(500),
  // projectImage: z
  //   .instanceof(File)
  //   .optional()
  //   .refine((file) => {
  //     return !file || file.size <= MAX_FILE_SIZE;
  //   }, "File size must be less than 3MB")
  //   .refine((file) => {
  //     return ACCEPTED_IMAGE_TYPES.includes(file ? file.type : "");
  //   }, "File must be a PNG, JPEG or JPG."),
  // steps: z.array(
  // 	z.object({
  // 		title: z.string().min(2).max(50),
  // 		content: z.string().min(2).max(500),
  // 		images: z.array(
  // 			z
  // 				.any()
  // 				.refine((files) => files?.length === 1, "Image is required.")
  // 				.refine(
  // 					(files) => files?.[0]?.size <= MAX_FILE_SIZE,
  // 					"Max file size is 5MB.",
  // 				)
  // 				.refine(
  // 					(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  // 					".jpg, .jpeg, .png files are accepted.",
  // 				),
  // 		),
  // 	}),
  // ),
});

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function ProjectForm(): React.JSX.Element {
  const createProject = api.project.create.useMutation({
    onMutate: () => {
      console.log("mutating");
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Your project has been created successfully.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Project Creation Failed",
        description: error.message,
      });
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createProject.mutateAsync({
      projectName: values.projectName,
      //category: values.category as Category,
      projectDescription: values.projectDescription,
      // projectImage: form.getValues("projectImage"),
      // steps: [""],
      created_by: "Steve",
    });
    console.log("After Mutation");
  }

  return (
    <div className="mx-auto flex flex-col">
      <h1 className="mb-6 text-4xl">New Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <hr className="border border-white/10" />
          {/* Project Name */}
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              // <div className="flex flex-col gap-4">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Project Name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="border border-white/10" />
          {/* Project Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Test" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <hr className="border border-white/10" />
          {/* Project Description */}
          <FormField
            control={form.control}
            name="projectDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Project Description"
                    {...field}
                    className="to-slate-900"
                  />
                </FormControl>
                <FormMessage className="relative mt-4 text-red-600" />
              </FormItem>
            )}
          />
          <hr className="border border-white/10" />
          {/* Project Image */}
          {/*<div className="flex flex-row gap-6 pt-4">
            <FormField
              control={form.control}
              name="projectImage"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} value={undefined} type="file" />
                     <Label
											className="text-sm bg-gradient-to-b from-slate-900 to-slate-800 hover:bg-slate-700 text-white border border-white p-2 rounded-lg mb-2"
											htmlFor="fileUpload"
										>
											Add Image
                    <Input
												id="fileUpload"
												accept="image/png, image/jpeg, image/jpg"
												type="file"
												onChange={onImageFileChange}
												{...field}
											/>
                    </Label>
                  </FormControl>
                  <p className="mt-4 w-64 rounded-md border px-2 py-1">
                    {field.value?.type ?? "file location"}
                  </p>
                  <FormMessage className="mt-4 text-red-600" />
                </FormItem>
              )}
            />
          </div> */}
          {/* <hr className="border border-white/10" /> */}
          <Button
            disabled={!form.formState.isValid}
            type="submit"
            className="border border-white"
          >
            Next
          </Button>
        </form>
      </Form>
    </div>
  );
}
