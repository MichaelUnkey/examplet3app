import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { ProjectCard } from "./components/projectCard"

export default async function Home() {
  
  const session = await getServerAuthSession();
  const hello = await api.post.hello({ text: session?.user.toString() ?? "Quest" });
  void api.post.getLatest.prefetch();

  return (session?.user ?
    <HydrateClient>
       <main className="flex min-h-screen flex-col p-6 text-gray-900">
        
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        <ProjectCard />
      </main>
    </HydrateClient>
    : <div>Please Sign In</div>
  );
}
