import { Project } from "@/types/project";

export async function getProject(id: string, token: string) {
    const data: { project: Project & { minutes_today: number } | null } = await fetch(`/api/projects/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        }
    }).then((r) => r.json());

    // console.log(data);
    if (!data || !data.project) return null;

    return data.project;
}