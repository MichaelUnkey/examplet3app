"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/app/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/app/components/ui/form";
import { Input } from "~/app/components/ui/input";
import { z } from "zod";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/toaster";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ACCEPTED_IMAGE_TYPES = ["image/*,.jpeg", "image/*,.jpg", "image/*,.png"];
const formSchema = z.object({
	title: z.string().min(2).max(50),
	description: z
		.string()
		.min(10, { message: "Must be 10 or more characters long" })
		.max(500, { message: "Must be 500 or less characters long" }),
	projectId: z.string(),
	stepNumber: z.number(),
	image: z
		.instanceof(File)
		.refine(
			(file) => !ACCEPTED_IMAGE_TYPES.includes(file?.type),
			"Only .jpg, .jpeg and .png formats are supported.",
		)
		.optional(),
});
type ProjectType = {
	projectId: string;
	stepCount: number;
}
export function StepForm({
	project,
}: { project: ProjectType }): React.JSX.Element {
	const [stepImage, setStepImage] = useState<string>();
	const [stepNumber, setStepNumber] = useState<number>(project.stepCount + 1);
	const router = useRouter();
	const createStep = api.step.create.useMutation({
		onMutate: () => {
			console.log("mutating");
		},
		onSuccess: () => {
			toast("Your step has been created successfully.");
			form.reset();
		},
		onError: (error) => {
			toast(`Step Creation Failed ${error.message}`);
		},
	});
	if(project.projectId === undefined) {
		return <div>Project ID is undefined</div>
	}
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			stepNumber: stepNumber,
			projectId: project.projectId,
			image: undefined,
		},
	});

	async function handleImageChange(fileList: FileList): Promise<string> {
		const res = new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			const file = fileList[0];
			if (file) {
				reader.readAsDataURL(file);
				reader.onload = (readerEvent: ProgressEvent<FileReader>) => {
					if (readerEvent.target?.result) {
						const imageFile = reader.result as string;
						resolve(imageFile);
					} else {
						reject(new Error("Failed to read image file."));
					}
				};
			}
		});
		res.then((imageFile) => {
			setStepImage(imageFile);
		});
		return res;
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await createStep.mutateAsync({
			title: values.title,
			description: values.description,
			stepNumber: values.stepNumber,
			projectId: values.projectId,
			image: stepImage,
		});
		router.refresh();
		form.reset();
		form.setValue("title", "");
		form.setValue("description", "");
	}
	return (
		<div className="mx-auto flex flex-col mt-12 w-full px-6 text-center">
			<h1 className="mb-6 text-2xl font-semibold">Add Step</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<hr className="border border-white/10" />
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="Title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<Textarea
									placeholder="Description"
									{...field}
									className="to-slate-900"
								/>
								<FormMessage />
							</FormItem>
						)}
					/>
					<hr className="border border-white/10" />
					<div className="flex flex-row gap-6 pt-4">
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											multiple={false}
											onChange={(e) =>
												handleImageChange(e.target.files as FileList)
											}
											type="file"
										/>
									</FormControl>
									<FormMessage className="mt-4 text-red-600" />
								</FormItem>
							)}
						/>
					</div>
					<hr className="border border-white/10" />
					<Button
						disabled={!form.formState.isValid}
						type="submit"
						className="border border-white disabled:border-red-600"
					>
						Next
					</Button>
				</form>
			</Form>
		</div>
	);
}
