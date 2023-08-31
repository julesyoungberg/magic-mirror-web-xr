// based on: https://github.com/hugozanini/realtime-semantic-segmentation/blob/master/src/index.js
import * as tf from "@tensorflow/tfjs";

import { useWebcam } from "@/hooks/useWebcam";
import { Background } from "../Background";
import { useSemanticSegmentation } from "@/hooks/useSemanticSegmentation";

const pascalvoc = [
    [0, 0, 0],
    [128, 0, 0],
    [0, 128, 0],
    [128, 128, 0],
    [0, 0, 128],
    [128, 0, 128],
    [0, 128, 128],
    [128, 128, 128],
    [64, 0, 0],
    [192, 0, 0],
    [64, 128, 0],
    [192, 128, 0],
    [64, 0, 128],
    [192, 0, 128],
    [64, 128, 128],
    [192, 128, 128],
    [0, 64, 0],
    [128, 64, 0],
    [0, 192, 0],
    [128, 192, 0],
    [0, 64, 128],
    [128, 64, 128],
    [0, 192, 128],
    [128, 192, 128],
    [64, 64, 0],
    [192, 64, 0],
    [64, 192, 0],
    [192, 192, 0],
    [64, 64, 128],
    [192, 64, 128],
    [64, 192, 128],
    [192, 192, 128],
    [0, 0, 64],
    [128, 0, 64],
    [0, 128, 64],
    [128, 128, 64],
    [0, 0, 192],
    [128, 0, 192],
    [0, 128, 192],
    [128, 128, 192],
    [64, 0, 64],
];

export function SegmentationDemo() {
    const webcam = useWebcam();

    useSemanticSegmentation(async (predictions) => {
        console.log(predictions);

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
                bytes[j + 0] = 255;
                bytes[j + 1] = 255;
                bytes[j + 2] = 255;
                bytes[j + 3] = 255;
            } else {
                const color = pascalvoc[partId + offset];

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

    if (!webcam) {
        return null;
    }

    return (
        <>
            <Background texture={webcam?.texture} />
        </>
    );
}
