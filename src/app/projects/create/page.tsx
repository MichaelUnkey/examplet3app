"use client";
import * as React from "react";
import { ProjectForm } from "~/app/components/project-form";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 text-slate-50">
      <ProjectForm />
    </main>
  );
}
