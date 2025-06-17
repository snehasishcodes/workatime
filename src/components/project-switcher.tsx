"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function ProjectSwitcher({ projects }: { projects?: any[] }) {
    const [selectedProject, setSelectedProject] = useState();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-fit flex items-center gap-2 py-2.5 px-3 border border-dashed rounded-lg cursor-pointer hover:bg-accent">
                <Avatar className="rounded-md h-8 w-8">
                    <AvatarFallback className="rounded-sm bg-primary text-primary-foreground">
                        TE
                    </AvatarFallback>
                </Avatar>
                <div className="text-start flex flex-col gap-1 leading-none">
                    <span className="text-sm leading-none font-semibold truncate max-w-[17ch]">
                        Test Project Name
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
                        Test Project Subtext
                    </span>
                </div>
                <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="start">
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                <DropdownMenuItem>
                    <div className="flex items-center gap-2">
                        <Avatar className="rounded-md h-8 w-8">
                            <AvatarFallback className="rounded-sm bg-primary/10 text-foreground">
                                TE
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span>
                                Test Project Name
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Test Project Subtext
                            </span>
                        </div>
                    </div>
                    <Check className="ml-auto" />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer">
                    <div className="flex items-center gap-2">
                        <PlusIcon />
                        <span className="text-medium">
                            New Project
                        </span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}