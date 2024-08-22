import * as React from "react";
import { ProjectForm } from "~/app/components/project-form";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 text-slate-50">
      <ProjectForm />
    </main>
  );
}
