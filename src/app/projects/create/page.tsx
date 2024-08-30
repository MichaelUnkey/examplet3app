"use client";
import * as React from "react";
import { ProjectForm } from "~/app/components/project-form";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col items-center justify-center text-slate-900 bg-slate-200">
      <ProjectForm />
    </main>
  );
}
