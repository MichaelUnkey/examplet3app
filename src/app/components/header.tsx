
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { userAgent } from "next/server";
import { getServerAuthSession } from "~/server/auth";

export async function Header() {
	const session = await getServerAuthSession();
	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Upload", path: "/create" },
		{ name: "Profile", path: "/profile" },
		{ name: session?.user ? "Sign Out" : "Sign In", path: session?.user ? "/api/auth/signout" : "/api/auth/signin" }
	];
	
	return (
		<div className="flex flex-row w-full h-16 border border-b-4 border-gray-300">
			<div className="my-auto pl-4 w-1/6">
				<p>Project Share</p>
			</div>
			<div className="flex flex-row gap-8 my-auto w-full ">
				{navLinks.map((link) => (
					link.name === "Sign Out" || link.name === "Sign In" ? 
					<div key={link.name} className="flex justify-end content-end item-end font-semibold ">
						<Link href={link.path}>
							<p>{link.name}</p>
						</Link>
					</div>
					:
					<div key={link.name} className="flex flex- mx-4 font-semibold">
						<Link href={link.path}>
							<p>{link.name}</p>
						</Link>
					</div>
				))}
			</div>
			<div className="flex flex-row justify-end my-auto mr-4">
				<input
					type="text"
					placeholder="Search"
					className="border border-black rounded-full p-1 h-8 w-48 my-auto"
				/>
				<div className="my-auto ml-4">
					{session?.user ? (<Avatar className="my-auto h-8 w-8">
						<AvatarImage src={""} alt="user icon" />
						<AvatarFallback className="border-2 border-black/70">{"MS"}</AvatarFallback>
					</Avatar>) : <p>Guest</p>}
					
					{/* Needs auth and userMenu component */}
					
				</div>
			</div>
		</div>
	);
}
