import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  return (session?.user ?
    <div>Please Sign In</div>
    : redirect("/api/auth/signin")
  );
}
