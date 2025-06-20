"use client";

import { CameraIcon, DownloadIcon, PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useActivityStore } from "@/store/activity.store";
import { toast } from "sonner";
import analyzeActivity from "@/lib/analyze-activity";
import { useProjectStore } from "@/store/project.store";

export default function CameraPreview({ token }: { token: string }) {
    const { project } = useProjectStore();
    const { isTracking, activityDetails, recordingEnabled } = useActivityStore();
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);
    const [permission, setPermission] = useState<"granted" | "denied" | "prompt" | "unknown">("unknown");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (navigator.permissions) {
            navigator.permissions.query({ name: "camera" as PermissionName })
                .then((result) => {
                    if (isMounted) setPermission(result.state as any);
                    result.onchange = () => {
                        if (isMounted) setPermission(result.state as any);
                    };
                })
                .catch(() => setPermission("unknown"));
        } else {
            setPermission("unknown");
        }
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (permission !== "granted") return;
        const enableCamera = async () => {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });
                setStream(streamData);
                if (videoRef.current) {
                    videoRef.current.srcObject = streamData;
                }
            } catch (err: any) {
                setError("Error accessing camera: " + err?.message);
            }
        };
        enableCamera();
        return () => {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
        };
    }, [permission]);

    useEffect(() => {
        if (!isTracking || permission !== "granted") return;

        const interval = setInterval(() => {
            if (!videoRef.current) return;
            const canvas = document.createElement("canvas");
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const screenshotData = canvas.toDataURL("image/png");

                analyzeActivity(
                    project,
                    screenshotData,
                    activityDetails,
                    token
                );
            }
        }, 15000); // every 15s

        return () => clearInterval(interval);
    }, [isTracking, permission]);

    // recording start/stop handler
    useEffect(() => {
        console.log("[camera-preview]: Recording URL Revoked");
        if (!recordingEnabled || permission !== "granted") return;

        if (isTracking) {
            if (stream) {
                console.log("[camera-preview]: Started Tracking Camera Activity");
                recordedChunksRef.current = [];
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (e) => {
                    if (e.data.size > 0) recordedChunksRef.current.push(e.data);
                };
                recorder.start();

                mediaRecorderRef.current = recorder;
            }
        } else {
            // stops and saves the entire stream into a video
            console.log("[camera-preview]: Stopped Tracking. Media Recorder:", mediaRecorderRef.current);

            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                mediaRecorderRef.current.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: "video/mp4" });
                    const url = URL.createObjectURL(blob);
                    console.log("[camera-preview]: Recording Video URL Created:", url);
                    setRecordedVideoURL(url);
                };
                mediaRecorderRef.current.stop();
                console.log("[camera-preview]: Media Recorder Stopped");
            }
        }
    }, [isTracking, recordingEnabled, stream, permission]);

    // cleanup
    useEffect(() => {
        return () => {
            if (recordedVideoURL) {
                URL.revokeObjectURL(recordedVideoURL);
                console.log("[camera-preview]: Recording URL Revoked");
            }
        };
    }, [recordedVideoURL]);


    const requestPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setPermission("granted");
        } catch {
            setPermission("denied");
        }
    }

    const downloadRecordedVideo = () => {
        if (!recordedVideoURL) return toast("Video recording not found.");
        const a = document.createElement("a");
        a.href = recordedVideoURL;
        a.download = `activity-record-${Date.now()}.mp4`;
        a.click();
        toast("Downloading Video...");
    }

    return (
        <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold flex gap-2 items-center">
                <CameraIcon size={20} /> Camera Preview
            </h2>
            {permission === "granted" && (
                <div className="w-full h-auto border border-dashed rounded-lg relative aspect-video">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-contain rounded-lg aspect-video"
                    />
                </div>
            )}
            {permission === "prompt" && (
                <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 aspect-video">
                    <p className="mb-2">Camera access is required to show the preview.</p>
                    <Button size="sm" onClick={requestPermission}>
                        Allow Camera Access
                    </Button>
                </div>
            )}
            {permission === "denied" && (
                <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-6 text-muted-foreground aspect-video">
                    <p>Camera access denied. Please enable camera permissions in your browser settings.</p>
                </div>
            )}
            {error && <div className="text-muted-foreground">{error}</div>}

            {
                recordedVideoURL && (
                    <div className="w-full flex flex-row items-center gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" variant="link">
                                    <PlayIcon /> Recording Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Activity Recording Preview</DialogTitle>
                                    <DialogDescription>
                                        This video is not saved in our database, so you might want to download it right now, incase you need it later.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="w-full h-auto aspect-video">
                                    <video
                                        id="activity-recording-preview"
                                        src={recordedVideoURL}
                                        controls
                                        className="w-full rounded-lg aspect-video border border-dashed"
                                    />
                                </div>

                                <DialogFooter>
                                    <Button
                                        size="sm"
                                        onClick={downloadRecordedVideo}
                                    >
                                        <DownloadIcon /> Save Recording (.mp4)
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={downloadRecordedVideo}
                        >
                            <DownloadIcon /> Save Recording (.mp4)
                        </Button>
                    </div>
                )
            }
        </div>
    );
}