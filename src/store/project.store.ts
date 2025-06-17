import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProjectStore {
    project: string
    setProject: (projectID: string) => void
}

export const useProjectStore = create<ProjectStore>()(
    persist(
        (set) => ({
            project: "",
            setProject: (projectID: string) =>
                set(() => ({
                    project: projectID
                }))
        }),
        {
            name: "workatime_current_project"
        }
    )
)