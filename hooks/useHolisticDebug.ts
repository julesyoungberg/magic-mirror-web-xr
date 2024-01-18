import * as mpHolistic from "@mediapipe/holistic";
import { drawLandmarks } from "@mediapipe/drawing_utils";
import { useCallback } from "react";

import { useCanvasTexture } from "./useCanvasTexture";
import { useWebcam } from "./useWebcam";

export function useHolisticDebug() {
    const webcam = useWebcam();
    const canvasTexture = useCanvasTexture({ width: 1280, height: 720 });

    const drawFeatures = useCallback(
        (results: mpHolistic.Results) => {
            // console.log(results);

            canvasTexture.canvasCtx.clearRect(
                0,
                0,
                canvasTexture.canvas.width,
                canvasTexture.canvas.height
            );
            if (webcam.canvas) {
                canvasTexture.canvasCtx.drawImage(
                    webcam.canvas,
                    0,
                    0,
                    canvasTexture.canvas.width,
                    canvasTexture.canvas.height
                );
            }
            if (results.segmentationMask) {
                canvasTexture.canvasCtx.save();
                canvasTexture.canvasCtx.globalCompositeOperation = "multiply";
                canvasTexture.canvasCtx.drawImage(
                    results.segmentationMask,
                    0,
                    0,
                    canvasTexture.canvas.width,
                    canvasTexture.canvas.height
                );
                canvasTexture.canvasCtx.restore();
            }
            drawLandmarks(canvasTexture.canvasCtx, results.faceLandmarks);
            drawLandmarks(canvasTexture.canvasCtx, results.leftHandLandmarks);
            drawLandmarks(canvasTexture.canvasCtx, results.rightHandLandmarks);
            drawLandmarks(canvasTexture.canvasCtx, results.poseLandmarks);
            canvasTexture.texture.needsUpdate = true;
            // draw segmentation
            // results.segmentationMask;
        },
        [canvasTexture]
    );

    return {
        canvasTexture,
        drawFeatures,
    };
}
