import { CanvasTexture, initCanvasTexture } from "@/hooks/useCanvasTexture";
import { useFrame } from "@react-three/fiber";
import React, { useMemo } from "react";

export const VIDEO_SIZE = { width: 512, height: 360 };

function initWebcamVideo() {
    const video = document.createElement("video");
    const constraints = { video: VIDEO_SIZE };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = () => {
                video.setAttribute("autoplay", "true");
                video.setAttribute("playsinline", "true");
                video.play();
            };
        })
        .catch((err) => {
            alert(err.name + ": " + err.message);
        });
    return video;
}

export type Webcam = CanvasTexture & {
    video: HTMLVideoElement;
};

export const WebcamContext = React.createContext<Webcam | null>(null);

type Props = React.PropsWithChildren<{}>;

export default function WebcamProvider({ children }: Props) {
    const webcam = useMemo(() => {
        return {
            video: initWebcamVideo(),
            ...initCanvasTexture(VIDEO_SIZE),
        };
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
