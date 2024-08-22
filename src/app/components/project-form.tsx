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
	projectImage: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			return !file || file.size <= MAX_FILE_SIZE;
		}, "File size must be less than 3MB")
		.refine((file) => {
			return ACCEPTED_IMAGE_TYPES.includes(file ? file.type : "");
		}, "File must be a PNG, JPEG or JPG."),
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
export function ProjectForm(session: any) {
	const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
	const [name, setName] = React.useState<string | undefined>(undefined);
	const [category, setCategory] = React.useState<Category | undefined>(undefined);
	const [description, setDescription] = React.useState<string | undefined>(undefined);
	const [steps, setSteps] = React.useState<Steps | undefined>(undefined);

	const mutation = api.project.create.useMutation({
		onSuccess: () => {
			toast({
				title: "Project Created",
				description: "Your project has been created successfully.",
			});
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
		defaultValues: {},
	});
	async function handleSubmit(values: z.infer<typeof formSchema>) {
		console.log("Upload started");
		if (!session.user) {
			toast({
				title: "No User Session Found",
				description: "Please sign in to submit a project",
			});
			return;
		}
		console.log(values);

		
		await mutation.mutateAsync({
			projectName: form.getValues("projectName").toString(),
			category: form.getValues("category") as Category,
			projectDescription: form.getValues("projectDescription"),
			// projectImage: form.getValues("projectImage"),
			// steps: [""],
			created_by: session.user.id,
		});
		console.log("After Mutation");
	}

	return (
		<div className="flex flex-col mx-auto">
			<h1 className="mb-6 text-4xl">New Project</h1>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleSubmit)}
					className="space-y-4"
				>
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
									<Select onValueChange={field.onChange}>
										<SelectTrigger className="bg-slate-900 m-0 p-2">
											<SelectValue
												placeholder={"Select a Category"}
												className="text-white bg-slate-900 m-0 p-0 h-full w-full"
											/>
										</SelectTrigger>
										<SelectContent className="p-0 bg-slate-900 ">
											{CATEGORYS.map((category) => {
												return (
													<SelectItem
														key={category}
														value={category}
														className="text-white"
													>
														{category}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage className="text-red-600 relative mt-4" />
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
								<FormMessage className="text-red-600 relative mt-4" />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					{/* Project Image */}
					 <div className="flex flex-row gap-6 pt-4">
						<FormField
							control={form.control}
							name="projectImage"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} value={undefined} type="file" />
										{/* <Label
											className="text-sm bg-gradient-to-b from-slate-900 to-slate-800 hover:bg-slate-700 text-white border border-white p-2 rounded-lg mb-2"
											htmlFor="fileUpload"
										>
											Add Image */}
											{/* <Input
												id="fileUpload"
												accept="image/png, image/jpeg, image/jpg"
												type="file"
												onChange={onImageFileChange}
												{...field}
											/> */}
										{/* </Label> */}
									</FormControl>
									<p className="border py-1 px-2 mt-4 w-64 rounded-md">
										{field.value?.type ?? "file location"}
									</p>
									<FormMessage className="text-red-600 mt-4" />
								</FormItem>
							)}
						/>
					</div>
					{/* <hr className="border border-white/10" /> */}
					<Button type="submit" className="border border-white">
						Next
					</Button>
				</form>
			</Form>
		</div>
	);
}
