"use client";

import { useState } from "react";
import Image from "next/image"; // Import the Image component from the appropriate package
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { Rocket, DownloadCloudIcon, MessageCircleIcon } from "lucide-react";

export function ProjectCard() {
	return (
		<div className="flex flex-col m-4">
			<Image
				src="https://picsum.photos/300/250"
				alt="Project 1"
				width={300}
				height={250}
			/>{" "}
			{/* Use the Image component with the correct props */}
			<div className="flex flex-row h-12">
				<Avatar className="h-8 w-8 my-auto mx-4">
					<AvatarImage />
					<AvatarFallback className="border-2 border-black/70">
						{"MS"}
					</AvatarFallback>
				</Avatar>
				<div className="flex flex-col my-auto">
					<p className="text-xs font-bold">Project 1</p>
					<p className="text-xs font-medium">Mike Silva</p>
				</div>
				<div className="flex flex-row m-auto gap-4">
					<div className="flex flex-row">
						<Rocket size={16} className="mt-1" />
						<p>12</p>
					</div>
					<div className="flex flex-row">
						<DownloadCloudIcon size={12} className="mt-1" />
						<p>4</p>
					</div>
					<div className="flex flex-row">
						<MessageCircleIcon size={12} className="mt-1" />
						<p>45</p>
					</div>
				</div>
			</div>
		</div>
	);
}
