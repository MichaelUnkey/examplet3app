
import Link from "next/link";
import * as React from "react"
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ProjectForm } from "~/app/components/project-form";




export default async function Page() {
	const session = await getServerAuthSession();
	if (!session?.user) {
		redirect("/api/auth/signin");
	}

	
	return (
		<HydrateClient>
			<main className="flex min-h-screen w-full mx-auto flex-col items-center justify-center bg-slate-900 text-slate-50">
				<ProjectForm session={session}/>
			</main>
		</HydrateClient>
	);
}
