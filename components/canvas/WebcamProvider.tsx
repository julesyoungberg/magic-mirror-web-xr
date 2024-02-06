import { CanvasTexture, initCanvasTexture } from "@/hooks/useCanvasTexture";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";

export const VIDEO_SIZE = { width: 512, height: 360 };

function initWebcamVideo() {
    const video = document.createElement("video");
    const constraints = { video: { ...VIDEO_SIZE, facingMode: "user" } };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.play();
            // video.onloadedmetadata = () => {
            //     video.setAttribute("autoplay", "true");
            //     video.setAttribute("playsinline", "true");
            //     video.play();
            // };
        })
        .catch((err) => {
            alert(err.name + ": " + err.message);
        });
    return video;
}

export type Webcam = CanvasTexture & {
    prevFrame: CanvasTexture;
    video: HTMLVideoElement;
};

export const WebcamContext = React.createContext<Webcam>(null!);

type Props = React.PropsWithChildren<{}>;

export default function WebcamProvider({ children }: Props) {
    const three = useThree();
    const frameCount = useRef(0);

    const webcam = useMemo(() => {
        return {
            prevFrame: initCanvasTexture(VIDEO_SIZE),
            video: initWebcamVideo(),
            ...initCanvasTexture(VIDEO_SIZE),
        };
    }, []);

    useFrame(() => {
        if (webcam.video.readyState === webcam.video.HAVE_ENOUGH_DATA) {
            if (frameCount.current > 0) {
                // save current frame
                webcam.prevFrame.canvasCtx.scale(-1, 1);
                webcam.prevFrame.canvasCtx.drawImage(
                    webcam.canvas,
                    0,
                    0,
                    webcam.canvas.width * -1,
                    webcam.canvas.height
                );
                webcam.canvasCtx.restore();
                webcam.prevFrame.texture.needsUpdate = true;
            }

            // write current frame
            webcam.canvasCtx.scale(-1, 1);
            webcam.canvasCtx.drawImage(
                webcam.video,
                0,
                0,
                webcam.canvas.width * -1,
                webcam.canvas.height
            );
            webcam.canvasCtx.restore();
            webcam.texture.needsUpdate = true;
            frameCount.current += 1;
        }
    }, 1);

    return (
        <WebcamContext.Provider value={webcam}>
            {children}
        </WebcamContext.Provider>
    );
}
