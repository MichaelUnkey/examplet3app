import { api, HydrateClient } from "~/trpc/server";
import { getServerAuthSession } from "~/server/auth";
import { ProjectCard } from "../components/projectCard";
import Link from "next/link";
import PageTitle from "../components/pageTitle";
import { FilePlus2 } from "lucide-react";
export default async function Page() {
	//   const hello = await api.post.hello({ text: "from tRPC" });
	const projects = await api.project.getUserProjects();
	const session = await getServerAuthSession();
	return (
		<HydrateClient>
			<div className="flex flex-col w-full bg-gray-200/20">
				<div className="flex flex-row w-full h-16 items-start justify-center">
					<PageTitle title="Projects" />
					
				</div>
                <div className="flex justify-end mr-24 mt-12">
						<Link href="/projects/create" className="flex flex-row rounded-full px-4 py-1.5 border border-violet-900 shadow-md shadow-violet-600 hover:scale-105">
							<p className=" text-lg font-semibold my-auto">Create New</p>
							<FilePlus2 size={32} className="inline ml-6 text-violet-800"/>
						</Link>
				</div>
				{session?.user ? (
					<div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 text-center gap-10 justify-center text-slate-900 w-full mt-6 p-8">
						{projects.map((project) => (
							<Link href={`/projects/${project.id}/`} key={project.id}>
								<ProjectCard
									key={project.id.substring(0, 8)}
									project={project}
									session={session}
								/>
							</Link>
						))}
					</div>
				) : (
					<p>Guest</p>
				)}
			</div>
		</HydrateClient>
	);
}
