"use client";

import { CameraIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export default function CameraPreview() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const enableCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        enableCamera();

        return () => {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-LG font-semibold flex gap-2 items-center">
                <CameraIcon size={20} /> Camera Preview
            </h2>

            <div className="w-full h-fit border border-dashed rounded-lg relative aspect-video">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
        </div>
    )
}