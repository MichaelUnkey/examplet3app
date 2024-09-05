import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getServerAuthSession } from "~/server/auth";
import { HeaderNav } from "./headerNav";
// import { usePathname } from "next/navigation";

export async function Header() {
	const session = await getServerAuthSession();
	const isAuthed = session?.user?.id !== undefined || session?.user?.id !== null;

	return (
		<div className="flex flex-row w-full h-16 border border-b-4 border-gray-300 position">
			<div className="my-auto pl-4 w-1/6 pr-8">
				<p className="whitespace-nowrap text-lg font-bold">Project Share</p>
			</div>
			<HeaderNav loggedIn={isAuthed} />
			<div className="flex flex-row justify-end my-auto mr-4">
				<input
					type="text"
					placeholder="Search"
					className="border border-black rounded-full p-1 h-8 w-48 my-auto"
				/>
				<div className="my-auto ml-4">
					{session?.user ? (
						<Avatar className="my-auto h-8 w-8">
							<AvatarImage
								src={session?.user?.image ?? undefined}
								alt="user icon"
							/>
							<AvatarFallback className="border-2 border-black/70">
								{}
							</AvatarFallback>
						</Avatar>
					) : (
						<p>Guest</p>
					)}

					{/* Needs auth and userMenu component */}
				</div>
			</div>
		</div>
	);
}
