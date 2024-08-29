import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import { Edit2Icon } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { UpdateProjectName } from "~/app/components/updateProjectName";
import { TRPCError } from "@trpc/server";
import { StepForm } from "~/app/components/stepForm";
import type { ProjectSchema } from "~/lib/types";

export default async function Page({
	params,
}: { params: { projectId: string } }) {
	const res = await api.project.getProjectById({
		projectId: params.projectId,
	});
	const session = await getServerAuthSession();
	const project = res instanceof TRPCError ? null : res as ProjectSchema;

	return (
		<HydrateClient>
			<div className="flex flex-col w-1/2 mx-auto h-screen bg-gray-200/20 top-12 p-4">
				{session?.user ? (
					<div className="flex flex-col items-start [&>*]:text-slate-900 justify-center pt-4 pb-8 bg-white shadow-lg w-fit p-4 mx-auto rounded-lg shadow-slate-300">
						<div className="flex flex-row w-full aspect-w-16 aspect-h-9">
							<Image
								className="object-cover"
								src={project?.projectImage ?? ""}
								alt="Project Image"
								width={1920}
								height={1080}
							/>
						</div>
						<div className="relative w-full">
							<Button
								variant={"ghost"}
								className="absolute bottom-4 right-4 h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400 bg-white"
							>
								<Edit2Icon size={14} />
							</Button>
						</div>
						<div className="inline-flex content-center mt-6 gap-4 pl-6">
							<p className="my-auto font-semibold">Project Name:</p>
							<p className="my-auto">{project?.projectName}</p>
							<UpdateProjectName
								projectId={params.projectId}
								name={project?.projectName ?? ""}
							/>
						</div>
						<div className="inline-flex content-center mt-6 gap-4 pl-6">
							<p className="my-auto font-semibold">Category:</p>
							<p className="my-auto">{project?.category}</p>
							<Button
								variant={"ghost"}
								className="h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400"
							>
								<Edit2Icon className="" size={14} />
							</Button>
						</div>
						<div className="inline-flex content-center mt-6 gap-4 pl-6 h-22">
							<p className="font-semibold text-nowrap">Project Description:</p>
							<p className="my-auto text-wrap break-words">
								{project?.projectDescription}
							</p>
							<Button
								variant={"ghost"}
								className="max-h-22 max-w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400 "
							>
								<Edit2Icon className="" size={14} />
							</Button>
						</div>
						{/* Category */}

						{/* Steps */}
						{/* Comments */}
						{/* Add Comment */}
						{project?.steps.map((step) => (
							<div key={step} className="flex flex-col gap-4">
								<p>{step}</p>
							</div>
						))}
						{project ? (
							<StepForm project={project}/>
						):(
							<p>No Project</p>
						)
						}
						
						
					</div>
				) : (
					<p>Guest</p>
				)}
			</div>
		</HydrateClient>                                                  
	);
}
