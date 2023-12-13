import {
    FilesetResolver,
    ImageSegmenter,
    ImageSegmenterResult,
} from "@mediapipe/tasks-vision";
import { VIDEO_SIZE } from "@/components/canvas/WebcamProvider";
import { useEffect, useRef, useState } from "react";
import { useWebcam } from "./useWebcam";
import { useCanvasTexture } from "./useCanvasTexture";
import { useFrame } from "@react-three/fiber";

// const legendColors = [
//     [255, 197, 0, 255], // Vivid Yellow
//     [128, 62, 117, 255], // Strong Purple
//     [255, 104, 0, 255], // Vivid Orange
//     [166, 189, 215, 255], // Very Light Blue
//     [193, 0, 32, 255], // Vivid Red
//     [206, 162, 98, 255], // Grayish Yellow
//     [129, 112, 102, 255], // Medium Gray
//     [0, 125, 52, 255], // Vivid Green
//     [246, 118, 142, 255], // Strong Purplish Pink
//     [0, 83, 138, 255], // Strong Blue
//     [255, 112, 92, 255], // Strong Yellowish Pink
//     [83, 55, 112, 255], // Strong Violet
//     [255, 142, 0, 255], // Vivid Orange Yellow
//     [179, 40, 81, 255], // Strong Purplish Red
//     [244, 200, 0, 255], // Vivid Greenish Yellow
//     [127, 24, 13, 255], // Strong Reddish Brown
//     [147, 170, 0, 255], // Vivid Yellowish Green
//     [89, 51, 21, 255], // Deep Yellowish Brown
//     [241, 58, 19, 255], // Vivid Reddish Orange
//     [35, 44, 22, 255], // Dark Olive Green
//     [0, 161, 194, 255], // Vivid Blue
// ];

export function useSegmentation() {
    const webcam = useWebcam();
    const processing = useRef(false);
    const canvasTexture = useCanvasTexture(VIDEO_SIZE);
    const [segmenter, setSegmenter] = useState<ImageSegmenter | undefined>(
        undefined
    );

    useEffect(() => {
        async function loadSegmenter() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );

            const imageSegmenter = await ImageSegmenter.createFromOptions(
                vision,
                {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite",
                        delegate: "GPU",
                    },
                    runningMode: "VIDEO",
                    outputCategoryMask: true,
                    outputConfidenceMasks: false,
                }
            );

            setSegmenter(imageSegmenter);
        }

        loadSegmenter();
    }, []);

    useFrame(() => {
        if (!segmenter || !webcam || processing.current) {
            return;
        }

        processing.current = true;

        segmenter.segmentForVideo(
            webcam.canvas,
            performance.now(),
            (result: ImageSegmenterResult) => {
                if (result.categoryMask?.canvas) {
                    let imageData = webcam.canvasCtx.getImageData(
                        0,
                        0,
                        webcam.canvas.width,
                        webcam.canvas.height
                    ).data;

                    const mask = result.categoryMask.getAsFloat32Array();
                    let j = 0;

                    for (let i = 0; i < mask.length; ++i, j += 4) {
                        if (mask[i] == 0) {
                            imageData[j] = 0;
                            imageData[j + 1] = 0;
                            imageData[j + 2] = 0;
                            imageData[j + 3] = 0;
                            continue;
                        }

                        // const maskVal = Math.round(mask[i] * 255.0);
                        // const legendColor =
                        //     legendColors[maskVal % legendColors.length];
                        // imageData[j] = (legendColor[0] + imageData[j]) / 2;
                        // imageData[j + 1] =
                        //     (legendColor[1] + imageData[j + 1]) / 2;
                        // imageData[j + 2] =
                        //     (legendColor[2] + imageData[j + 2]) / 2;
                        // imageData[j + 3] =
                        //     (legendColor[3] + imageData[j + 3]) / 2;
                    }

                    const uint8Array = new Uint8ClampedArray(imageData.buffer);
                    const dataNew = new ImageData(
                        uint8Array,
                        webcam.canvas.width,
                        webcam.canvas.height
                    );

                    canvasTexture.canvasCtx.putImageData(dataNew, 0, 0);
                    canvasTexture.texture.needsUpdate = true;
                }

                processing.current = false;
            }
        );
    });

    return canvasTexture;
}
