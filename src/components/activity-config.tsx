"use client";

import { ActivityIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useActivityStore } from "@/store/activity.store";

export default function ActivityConfig() {
    const { setActivityDetails, recordingEnabled, setRecordingEnabled } = useActivityStore();

    return (
        <div className="w-full border border-dashed rounded-lg flex flex-col gap-4 p-4">
            <h2 className="font-semibold flex gap-2 items-center">
                <ActivityIcon size={20} />
                <span>Your Activity</span>
            </h2>

            <div className="flex flex-col gap-2">
                <Label>
                    Activity Details
                </Label>
                <Input
                    type="text"
                    name="activity-details"
                    placeholder="Building a tower with playing cards"
                    maxLength={150}
                    required
                    onInput={(e) => setActivityDetails(e.currentTarget.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    checked={recordingEnabled}
                    onCheckedChange={(checked) => setRecordingEnabled(checked === true)}
                />
                <Label>
                    Record Activity Session
                </Label>
            </div>

            <p className="text-xs text-muted-foreground font-medium">
                Your live camera activity will be analyzed by an AI model every few seconds and time spent doing the activity will be calculated based on it. Your recorded live sessions are not saved or accessed by us.
            </p>
        </div>
    )
}