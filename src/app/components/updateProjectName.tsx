"use client";
import { api } from "~/trpc/react";
import { Edit2Icon } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "~/app/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "~/app/components/ui/form";
import { Input } from "~/app/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const dynamic = "force-dynamic";
const formSchema = z.object({
	projectId: z.string(),
	projectName: z.string(),
});

type Props = {
	projectId: string,
	name: string,
	
};

export const UpdateProjectName: React.FC<Props> = ({projectId, name}) => {
	const router = useRouter();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		mode: "all",
		shouldFocusError: true,
		delayError: 100,
		defaultValues: {
			projectId: projectId,
			projectName: name,
		},
	});
	const updateName = api.project.setProjectName.useMutation({
		onSuccess() {
			toast.success("Project name updated");
			router.refresh();
		},
		onError(err) {
			console.error(err);
			toast(err.message);
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const res = await updateName.mutateAsync({
			projectId: values.projectId,
			projectName: values.projectName,
		});
		if (res) {
			router.push(`/project/${projectId}`);
		}
	}
	

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Dialog>
					<DialogTrigger>
						<Button
							variant={"ghost"}
							className="bg-slate-800 absolute bottom-6 right-6 h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-white"
						>
							<Edit2Icon className=" text-white" size={22} />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<FormField
										control={form.control}
										name="projectName"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input {...field} type="text" />
												</FormControl>
												<FormMessage className="mt-4 text-red-600" />
											</FormItem>
										)}
									/>
									<Button type="submit">Save</Button>
								</form>
							</Form>
						</div>
					</DialogContent>
				</Dialog>
			</form>
		</Form>
	);
};
