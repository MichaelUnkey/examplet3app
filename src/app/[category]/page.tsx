import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { ProjectCard } from "../components/projectCard";
import PageTitle from "../components/pageTitle";

export default async function Page({
	params,
}: { params: { category: string } }) {
	const res = await api.project.getProjectsByCategory({
		category: params.category,
	});
	const projectList = res instanceof TRPCError ? null : res;
console.log(projectList);

	return (
		<div className="flex flex-col w-full">
			<div className="flex flex-row w-full">
			<PageTitle title={params.category.charAt(0).toUpperCase() + params.category.substring(1)} />
			</div>
			<div className="flex flex-row w-full flex-wrap p-8 gap-6 mx-auto justify-center">
				{projectList?.map((project) => {
					return (
						<>
							<div key={project.id} className="flex flex-col w-1/5">
								<ProjectCard project={project} />
							</div>
						</>
					);
				})}
			</div>
		</div>
	);
}
