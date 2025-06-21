"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Check, ChevronsUpDown, Loader2Icon, PlusIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { useProjectStore } from "@/store/project.store";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectSwitcher({ projects, token }: { projects: Project[], token: string }) {
    const { project, setProject } = useProjectStore();
    const [selectedProject, setSelectedProject] = useState<Project>();
    const [newProjectName, setNewProjectName] = useState<string>("");
    const [newProjectCreating, setNewProjectCreating] = useState<boolean>(false);

    useEffect(() => {
        if (!project) setSelectedProject(projects[0]);
        const currentProject = projects.find((p) => p.id === project);
        if (currentProject) setSelectedProject(currentProject);
    }, [projects, project]);

    const createNewProject = async () => {
        if (!newProjectName) return;
        setNewProjectCreating(true);

        const data: { project: Project | null } = await fetch("/api/projects/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${token}`
            },
            body: JSON.stringify({
                name: newProjectName
            })
        }).then((r) => r.json());

        if (!data || !data.project) return toast("Could not create project. Please retry.");

        setProject(data.project.id);
        setSelectedProject(data.project);
        setNewProjectCreating(false);
        toast(`Switched to Project: ${newProjectName}`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="w-fit flex items-center gap-2 py-2.5 px-3 border border-dashed rounded-lg cursor-pointer hover:bg-accent">
                <Avatar className="rounded-md h-8 w-8">
                    <AvatarFallback className="rounded-sm bg-primary text-primary-foreground">
                        {selectedProject?.name.toUpperCase().charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-start flex flex-col gap-1 leading-none">
                    <span className="text-sm leading-none font-semibold truncate max-w-[17ch]">
                        {selectedProject?.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[20ch]">
                        {selectedProject?.id}
                    </span>
                </div>
                <ChevronsUpDown className="ml-6 h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="start">
                <DropdownMenuLabel>Projects</DropdownMenuLabel>

                {projects.map((p) => (
                    <DropdownMenuItem key={p.id} onClick={() => setProject(p.id)}>
                        <div className="flex items-center gap-2">
                            <Avatar className="rounded-md h-8 w-8">
                                <AvatarFallback className="rounded-sm bg-primary/10 text-foreground">
                                    {p.name.toUpperCase().charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>
                                    {p.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {p.id}
                                </span>
                            </div>
                        </div>
                        {p.id === project ? <Check className="ml-auto" /> : null}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="ghost" className="w-full flex items-center gap-2">
                            <PlusIcon />
                            <span className="text-medium">
                                New Project
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                The new project will be selected as active on creation.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2">
                            <Label>Project Name</Label>
                            <Input
                                type="text"
                                name="project-name"
                                placeholder="Horcrux"
                                maxLength={36}
                                required
                                onInput={(e) => setNewProjectName(e.currentTarget.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                onClick={createNewProject}
                                disabled={newProjectCreating}
                            >
                                {
                                    newProjectCreating ?
                                        <Loader2Icon className="animate-spin" /> :
                                        <PlusIcon />
                                }
                                Create Project
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}