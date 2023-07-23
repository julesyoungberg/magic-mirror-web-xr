import {
    FilesetResolver,
    ImageSegmenter,
    ImageSegmenterResult,
} from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { useWebcam } from "./useWebcam";
import { useCanvasTexture } from "./useCanvasTexture";
import { useFrame } from "@react-three/fiber";

export function useSegmentation() {
    const webcam = useWebcam();
    const processing = useRef(false);
    const canvasTexture = useCanvasTexture({ width: 1280, height: 720 });
    const [segmenter, setSegmenter] = useState<ImageSegmenter | undefined>(
        undefined
    );

    useEffect(() => {
        async function loadSegmenter() {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
            );

            const imageSegmenter = await ImageSegmenter.createFromModelPath(
                vision,
                "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/1/deeplab_v3.tflite"
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
        segmenter.segment(webcam.canvas, (result: ImageSegmenterResult) => {
            if (result.categoryMask?.canvas) {
                console.log("result", result);
                canvasTexture.canvasCtx.drawImage(
                    result.categoryMask.canvas,
                    0,
                    0,
                    canvasTexture.canvas.width,
                    canvasTexture.canvas.height
                );
            }
            processing.current = false;
        });
    });

    return canvasTexture;
}
