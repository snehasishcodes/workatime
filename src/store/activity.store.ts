import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ActivityStore {
    isTracking: boolean
    trackingStartedTime: number | null

    activityDetails: string
    recordingEnabled: boolean

    setIsTracking: (v: boolean) => void
    setActivityDetails: (a: string) => void
    setRecordingEnabled: (v: boolean) => void
}

export const useActivityStore = create<ActivityStore>()(
    persist(
        (set) => ({
            isTracking: false,
            trackingStartedTime: null,
            activityDetails: "",
            recordingEnabled: false,

            setIsTracking: (v: boolean) =>
                set(() => ({
                    isTracking: v,
                    trackingStartedTime: v === true ? Date.now() : null
                })),
            setActivityDetails: (a: string) =>
                set(() => ({
                    activityDetails: a
                })),
            setRecordingEnabled: (v: boolean) =>
                set(() => ({
                    recordingEnabled: v
                }))
        }),
        {
            name: "workatime_activity_status"
        }
    )
)