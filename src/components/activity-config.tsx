import { ActivityIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ActivityConfig() {
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
                    required
                />
            </div>

            <p className="text-xs text-muted-foreground font-medium">
                Your live camera activity will be analyzed by an AI model every few seconds and time spent doing the activity will be calculated based on it. The entire live session may also be used later for verification purposes. Rest promised, your live activity sessions won&apos;t be accessable by third parties.
            </p>
        </div>
    )
}