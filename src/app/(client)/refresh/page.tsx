"use client"

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RefreshPage() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push("/");
        }, 2000);
    }, []);

    return (
        <main className="h-screen flex justify-center items-center">
            <Loader2Icon
                size={30}
                className="animate-spin"
            />
        </main>
    )
}