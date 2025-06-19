"use client";

import { Button } from "@/components/ui/button";
import { useActivityStore } from "@/store/activity.store";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TrackingControls() {
    const { isTracking, activityDetails, trackingStartedTime, setIsTracking } = useActivityStore();
    const [elapsedTime, setElapsedTime] = useState<{ hours: number, minutes: number, seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        if (!trackingStartedTime || !isTracking) return;
        const interval = setInterval(() => {
            const now = Date.now();
            const elapsedMs = now - trackingStartedTime;

            const totalSeconds = Math.floor(elapsedMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            setElapsedTime({ hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [trackingStartedTime, isTracking]);

    const formatTime = (num: number) => String(num).padStart(2, "0");

    const startTrackingActivity = () => {
        if (!activityDetails) return toast("Activity detail is required", {
            description: "Keep it short and straight to the point."
        });

        setIsTracking(true);
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 my-5">
            <div className="w-full flex flex-row justify-center items-center gap-">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    {isTracking ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                    <span>
                        {formatTime(elapsedTime.hours)}:{formatTime(elapsedTime.minutes)}:{formatTime(elapsedTime.seconds)}
                    </span>
                </h2>
            </div>

            {
                isTracking ?
                    <div className="w-full flex flex-row gap-4 items-center justify-center">
                        <Button
                            variant="destructive"
                            onClick={() => setIsTracking(false)}
                        >
                            <SquareIcon className="fill-current" />
                            <span>Stop Tracking</span>
                        </Button>
                    </div>
                    :
                    <Button
                        onClick={startTrackingActivity}
                    >
                        Start Tracking Activity
                    </Button>
            }
        </div>
    )
}