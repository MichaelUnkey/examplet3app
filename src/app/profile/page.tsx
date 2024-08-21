import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Page() {
//   const hello = await api.post.hello({ text: "from tRPC" });
//   const session = await getServerAuthSession();



  return (
    <HydrateClient>
        <div className="flex flex-col h-full p-6">
            <h1>Profile Page</h1>
        </div>
    </HydrateClient>
  );
}
