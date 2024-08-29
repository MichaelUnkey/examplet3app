import { HydrateClient } from "~/trpc/server";

export default async function Page({params}: {params: {category: string}}) {
  return (
    <HydrateClient>
        <div className="flex flex-col h-full p-6">
            <h1>{`${params.category.charAt(0).toUpperCase()}${params.category.slice(1).toString()}`}</h1>
        </div>
    </HydrateClient>
  );
}
