import * as tf from "@tensorflow/tfjs";

import { useSemanticSegmentation } from "./useSemanticSegmentation";
import { useWebcam } from "./useWebcam";

export function useWebcamSegmentation(
    getColor?: (index: number) => [number, number, number]
) {
    const webcam = useWebcam();

    useSemanticSegmentation(async (predictions) => {
        if (!webcam) {
            return;
        }

        const img_shape = [480, 480];
        const offset = 0;
        const segmPred = tf.image.resizeBilinear(
            predictions.transpose([0, 2, 3, 1]),
            img_shape
        );
        const segmMask = segmPred.argMax(3).reshape(img_shape);
        const width = segmMask.shape.slice(0, 1)[0];
        const height = segmMask.shape.slice(1, 2)[0];
        const data = await segmMask.data();
        const bytes = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < height * width; ++i) {
            const partId = data[i];
            const j = i * 4;
            if (partId === -1) {
                bytes[j + 0] = 0;
                bytes[j + 1] = 0;
                bytes[j + 2] = 0;
                bytes[j + 3] = 0;
            } else {
                const color = getColor?.(partId + offset) || [255, 255, 255];

                if (!color) {
                    throw new Error(
                        `No color could be found for part id ${partId}`
                    );
                }
                bytes[j + 0] = color[0];
                bytes[j + 1] = color[1];
                bytes[j + 2] = color[2];
                bytes[j + 3] = 255;
            }
        }
        const out = new ImageData(bytes, width, height);
        const ctx = webcam.canvas.getContext("2d");
        ctx?.scale(1.5, 1.5);
        ctx?.putImageData(out, 520, 60);
    });

    return webcam;
}
