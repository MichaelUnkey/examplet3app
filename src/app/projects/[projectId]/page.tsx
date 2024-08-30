import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import Image from "next/image";
import { Edit2Icon } from "lucide-react";
import { Button } from "~/app/components/ui/button";
import { UpdateProjectName } from "~/app/components/updateProjectName";
import { TRPCError } from "@trpc/server";
import { StepForm } from "~/app/components/stepForm";
import type { ProjectSchema } from "~/lib/types";
import { ProjectViewUser } from "~/app/components/projectViewUser";
import { Separator } from "~/app/components/ui/separator";
import PageTitle from "~/app/components/pageTitle";

export default async function Page({
	params,
}: { params: { projectId: string } }) {
	const res = await api.project.getProjectById({
		projectId: params.projectId,
	});
	const session = await getServerAuthSession();
	const project = res instanceof TRPCError ? null : (res as ProjectSchema);

	const stepList = await api.step.getStepByProjectId({
		projectId: project ? project.id : "",
	});

	return (
		<HydrateClient>
			<div className="flex flex-col w-full h-full bg-gray-200/20">
				<div className="flex flex-row w-full">
					<PageTitle title={project?.projectName ?? ""} />
				</div>
				<div className="w-full flex flex-col px-4 mt-2">
					<div className="flex flex-row max-h-96 items-start [&>*]:text-slate-900 justify-center pt-4 pb-8 bg-white w-full p-4 mx-auto rounded-lg ">
						<div className="flex flex-col shrink w-1/2">
							<div className="relative">
								<Image
									className="aspect-w-16 aspect-h-9 "
									src={project?.projectImage ?? ""}
									alt="Project Image"
									width={1920}
									height={1080}
								/>
								<Button
									variant={"ghost"}
									className="absolute top-4 right-4 h-22 w-22 px-2 rounded-xl shadow-md shadow-violet-600 border border-slate-400 bg-white"
								>
									<Edit2Icon size={14} />
								</Button>
							</div>
						</div>
						<div className="flex flex-col w-full">
							<div className=" gap-4 pl-6">
								<p className="my-auto font-semibold">Project Name:</p>
								<p className="my-auto ml-4">{project?.projectName}</p>
								{/* <UpdateProjectName
									projectId={params.projectId}
									name={project?.projectName ?? ""}
								/> */}
							</div>

							<div className="relative mt-4 gap-4 pl-6">
								<p className="my-auto font-semibold">Category:</p>
								<p className="my-auto ml-4">{project?.category}</p>
								{/* <Button
									variant={"ghost"}
									className="h-22 w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400"
								>
									<Edit2Icon className="" size={14} /> */}
								{/* </Button> */}
							</div>
							<div className="mt-6 gap-4 pl-6">
								<p className="font-semibold text-nowrap">
									Project Description:
								</p>
								<p className="ml-4 my-auto text-wrap break-words">
									{project?.projectDescription}
								</p>
								{/* <Button
									variant={"ghost"}
									className="max-h-22 max-w-22 px-2 rounded-xl shadow-md shadow-slate-600 border border-slate-400 "
								>
									<Edit2Icon className="" size={14} />
								</Button> */}
							</div>
						</div>
					</div>
					<div className="flex flex-col mt-4 bg-slate-100 rounded-lg pt-8">
						{stepList.map((step) => {
							return (
								<div key={step.id} className="flex flex-col mt-2 pl-6 gap-1">
									<p className="font-semibold text-nowrap text-xl">
										{step.title}
									</p>

									<div className="inline-flex content-center gap-4">
										{step.stepImage ? (
											<Image
												className="mt-8 ml-4 mb-4"
												src={step?.stepImage}
												alt="Step Image"
												width={500}
												height={300}
											/>
										) : null}
									</div>

									<div className="inline-flex content-center">
										<p className="ml-4 text-wrap break-words">
											{step.description}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</HydrateClient>
	);
}
