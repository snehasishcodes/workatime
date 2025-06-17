import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityStore {
    isTracking: boolean
    setIsTracking: (v: boolean) => void
}

export const useActivityStore = create<ActivityStore>()(
    persist(
        (set) => ({
            isTracking: false,
            setIsTracking: (v: boolean) =>
                set(() => ({
                    isTracking: v
                }))
        }),
        {
            name: "workatime_activity_status"
        }
    )
)