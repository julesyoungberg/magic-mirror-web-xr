import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";

function initWebcam() {
    const video = document.createElement("video");
    const constraints = { video: { width: 1280, height: 720 } };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = (e) => {
                video.setAttribute("autoplay", "true");
                video.setAttribute("playsinline", "true");
                video.play();
            };
        })
        .catch((err) => {
            alert(err.name + ": " + err.message);
        });
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        throw new Error("failed to get 2d canvas context");
    }
    canvasCtx.fillStyle = "#000000";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    return {
        canvas,
        canvasCtx,
        texture,
        video,
    };
}

export type Webcam = ReturnType<typeof initWebcam>;

export const WebcamContext = React.createContext<Webcam | null>(null);

type Props = React.PropsWithChildren<{}>;

export default function WebcamProvider({ children }: Props) {
    const webcam = useMemo(() => {
        return initWebcam();
    }, []);

    useFrame(() => {
        if (webcam.video.readyState === webcam.video.HAVE_ENOUGH_DATA) {
            webcam.canvasCtx.drawImage(
                webcam.video,
                0,
                0,
                webcam.canvas.width,
                webcam.canvas.height
            );
            webcam.texture.needsUpdate = true;
        }
    }, 1);

    return (
        <WebcamContext.Provider value={webcam}>
            {children}
        </WebcamContext.Provider>
    );
}
