"use client";

import Image from "next/image"; // Import the Image component from the appropriate package

import { Rocket, DownloadCloudIcon } from "lucide-react";
import type { Session } from "next-auth";
import {
	Card,
	CardContent,
} from "./ui/card";

type ProjectCardProps = {
	projectName: string | null;
	category: string;
	projectDescription: string;
	projectImage: string | null;
	id: string;
	created_by: string;
	createdAt: Date;
	updatedAt: Date | null;
	likes: number | null;
	makes: number | null;
	steps: string[];
};

export function ProjectCard({
	project,
	session,
}: { project: ProjectCardProps; session: Session }) {
	return (
		<Card className="w-full h-0 bg-white/80 shadow-xl shadow-slate-700/70 rounded-2xl aspect-w-2 aspect-h-3">
			<CardContent className="p-2 object-cover h-full">
				<div className="aspect-w-16 aspect-h-9">
					<Image
						className="p-0 m-0 overflow-clip rounded-xl object-cover"
						src={project?.projectImage ?? "/images/placeholder.webp"}
						alt="Project Image"
						width={500}
						height={300}
					/>
				</div>
				<div className="flex flex-col p-2 gap-4">
					<p className="text-start mt-4 text-lg h-12">{project?.projectName}</p>
					<p className="h-full text-left text-wrap overflow-hidden">{project?.projectDescription}</p>
					<div className="absolute bottom-3 ">
						<p className="inline text-left w-full">{session?.user.name} </p>
					</div>
					<div className="absolute right-4 bottom-3 space-x-3">
						<div className="inline-block rounded-full shadow px-2.5 shadow-gray-600">
						<Rocket size={16} className="inline-block"/>
						<p className="inline-block" >4</p>
						</div>
						<div className="inline-block rounded-full shadow px-2.5 shadow-gray-600">
						<DownloadCloudIcon size={12} className="inline-block" />
						<p className="inline-block" >4</p>
						</div>
					</div>
				</div>
			</CardContent>

			{/* <div className="flex flex-col p-8">
				{" "}
				<div className="flex flex-col my-auto ml-6">
					<Avatar className="h-12 w-12 mx-auto">
						<AvatarImage />
						<AvatarFallback className="border-2 border-black/70">
							{}
						</AvatarFallback>
					</Avatar> */}

			{/* <div className="flex flex-row">
						<Rocket size={16} className="mt-1" />
						<p>12</p>
					</div>
					<div className="flex flex-row">
						<DownloadCloudIcon size={12} className="mt-1" />
						<p>4</p>
					</div> */}
			{/* <div className="flex flex-row">
						<MessageCircleIcon size={12} className="mt-1" />
						<p>45</p>
					</div> */}
			{/* </div> */}
			{/* </div> */}
		</Card>
	);
}
