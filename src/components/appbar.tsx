import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import Link from "next/link";

export default function Appbar({ user }: { user: User | null }) {
    return (
        <nav className="w-full flex flex-row justify-between items-center gap-4 p-4 border-b border-dashed">
            <h2 className="text-2xl font-semibold">Workatime</h2>

            <div className="flex flex-row justify-end items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer border border-dashed">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.email.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    {
                        user && user.email ?
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Your Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>
                                    {user?.email}
                                </DropdownMenuItem>
                                <DropdownMenuItem disabled>
                                    Slack ID: {user?.id}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant="destructive" asChild>
                                    <Link href="/auth/logout">
                                        Log Out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            :
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Login to your account</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                    <Link href="/auth">
                                        Continue with Slack
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                    }
                </DropdownMenu>
            </div>
        </nav>
    )
}