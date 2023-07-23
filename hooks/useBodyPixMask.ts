import * as bodyPix from "@tensorflow-models/body-pix";
import { useCallback } from "react";

import { useCanvasTexture } from "./useCanvasTexture";
import { useWebcam } from "./useWebcam";

export function useBodyPixMask() {
    const webcam = useWebcam();
    const canvasTexture = useCanvasTexture({ width: 1280, height: 720 });

    const drawMask = useCallback((results: bodyPix.PartSegmentation[]) => {
        if (results.length === 0) {
            return;
        }

        const coloredPartImage = bodyPix.toColoredPartMask(results);
        const opacity = 0.7;
        const flipHorizontal = false;
        const maskBlurAmount = 0;
        bodyPix.drawMask(
            canvasTexture.canvas,
            webcam!.canvas,
            coloredPartImage,
            opacity,
            maskBlurAmount,
            flipHorizontal
        );
        canvasTexture.texture.needsUpdate = true;
    }, []);

    return {
        canvasTexture,
        drawMask,
    };
}
