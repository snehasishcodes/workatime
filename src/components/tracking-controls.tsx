"use client";

import { Button } from "@/components/ui/button";
import { useActivityStore } from "@/store/activity.store";
import { PauseIcon, PlayIcon, SquareIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function TrackingControls() {
    const { isTracking, trackingStartedTime, setIsTracking } = useActivityStore();
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

    return (
        <div className="flex flex-col justify-center items-center gap-4 my-5">
            <div className="w-full flex flex-row justify-center items-center gap-">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    {isTracking ? <PauseIcon /> : <PlayIcon />}
                    <span>
                        {formatTime(elapsedTime.hours)}:{formatTime(elapsedTime.minutes)}:{formatTime(elapsedTime.seconds)}
                    </span>
                </h2>
            </div>

            {
                isTracking ?
                    <div className="w-full flex flex-row gap-4 items-center justify-center">
                        <Button
                            size="lg"
                            variant="destructive"
                            onClick={() => setIsTracking(false)}
                        >
                            <SquareIcon className="fill-current" />
                            <span>Stop Tracking</span>
                        </Button>
                    </div>
                    :
                    <Button
                        size="lg"
                        onClick={() => setIsTracking(true)}
                    >
                        Start Tracking Activity
                    </Button>
            }
        </div>
    )
}