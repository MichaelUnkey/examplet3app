import * as React from "react";
import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 text-slate-50">
      <p>Pick a project to update </p>
      <p>Update and click save</p>
    </main>
  );
}
