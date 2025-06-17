import { CalendarClockIcon, ClockIcon, HistoryIcon } from "lucide-react";

export default function TimeSpent() {
    return (
        <div className="w-full border border-dashed rounded-lg flex flex-col gap-4 p-4">
            <h2 className="font-semibold flex gap-2 items-center">
                <ClockIcon size={20} />
                <span>Time Spent</span>
            </h2>

            <div className="w-full flex flex-row items-center justify-evenly gap-5">
                <div className="w-full flex flex-col gap-4 border border-dashed p-4 rounded-lg">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="w-10 h-10 bg-accent rounded-lg flex justify-center items-center">
                            <CalendarClockIcon />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Today
                        </h2>
                    </div>

                    <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40">
                        <span>
                            0h
                        </span>
                        {" "}
                        <span>
                            0m
                        </span>
                        {" "}
                        <span className="text-sm font-medium text-muted-foreground">
                            0s
                        </span>
                    </h1>
                </div>

                <div className="w-full flex flex-col gap-4 border border-dashed p-4 rounded-lg">
                    <div className="flex flex-row gap-4 items-center">
                        <div className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex justify-center items-center">
                            <HistoryIcon />
                        </div>
                        <h2 className="text-lg font-semibold">
                            Total
                        </h2>
                    </div>

                    <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/40">
                        <span>
                            0h
                        </span>
                        {" "}
                        <span>
                            0m
                        </span>
                        {" "}
                        <span className="text-sm font-medium text-muted-foreground">
                            0s
                        </span>
                    </h1>
                </div>
            </div>
        </div>
    )
}