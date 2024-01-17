/**
 * Optical flow effect where cubes are generated with colors from the source image.
 */
import { useCanvasTexture } from "@/hooks/useCanvasTexture";
import { useWebcam } from "@/hooks/useWebcam";
import { useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useRef } from "react";

import { Background } from "../../Background";
import { VIDEO_SIZE } from "../../WebcamProvider";

export function OpticalFlow() {
    const webcam = useWebcam();
    const prevFrame = useCanvasTexture(VIDEO_SIZE);
    const hasData = useRef(false);

    useFrame(() => {
        if (
            !webcam ||
            webcam.video.readyState !== webcam.video.HAVE_ENOUGH_DATA
        ) {
            return;
        }

        if (hasData.current) {
            /** @todo compute optical flow */
        }

        prevFrame.canvasCtx.scale(-1, 1);
        prevFrame.canvasCtx.drawImage(
            webcam.canvas,
            0,
            0,
            webcam.canvas.width * -1,
            webcam.canvas.height
        );
        prevFrame.canvasCtx.restore();
        prevFrame.texture.needsUpdate = true;
        hasData.current = true;
    });

    return (
        <Physics gravity={[0, -9.8, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            <pointLight position={[0, 10, 0]} castShadow />
        </Physics>
    );
}
