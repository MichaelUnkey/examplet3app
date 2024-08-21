import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "./components/header";
import { Categories } from "./components/categories";

export const metadata: Metadata = {
	title: "Openapi Example App",
	description: "Example app using Nextjs, Drizzle, Unkey, trpc and openapi",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body className="max-w-[2160px] mx-auto bg-gradient-to-b h-screen">
				<TRPCReactProvider>
					<Header />
					<div className="w-full flex flex-row bg-gray-200">
						<Categories />
						{children}{" "}
					</div>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
