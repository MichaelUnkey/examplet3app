import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./components/header";
import { Categories } from "./components/categories";
import { Toaster } from "sonner";
import { getServerAuthSession } from "~/server/auth";
import type { Session } from "next-auth";
export const metadata: Metadata = {
	title: "Openapi Example App",
	description: "Example app using Nextjs, Drizzle, Unkey, trpc and openapi",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const session = await getServerAuthSession();
	return (
		<html lang="en" className={`${GeistSans.variable}`}><TRPCReactProvider>
			<body className="max-w-[2160px] mx-auto bg-gradient-to-b h-screen">
				
					<Header session={session ? session : undefined} />
					<div className="w-full flex flex-row bg-slate-200">
						<Categories />
						{children}{" "}
						<Toaster />
					</div>
					
				
			</body>
			</TRPCReactProvider>
		</html>
	);
}
