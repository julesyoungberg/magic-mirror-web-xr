// based on: https://github.com/hugozanini/realtime-semantic-segmentation/blob/master/src/index.js
import { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import { useWebcam } from "./useWebcam";
import { useFrame } from "@react-three/fiber";

function processInput(video: HTMLCanvasElement | HTMLVideoElement) {
    const img = tf.browser.fromPixels(video).toFloat();
    const scale = tf.scalar(255);
    const mean = tf.tensor3d([0.485, 0.456, 0.406], [1, 1, 3]);
    const std = tf.tensor3d([0.229, 0.224, 0.225], [1, 1, 3]);
    const normalised = img.div(scale).sub(mean).div(std);
    const batched = normalised.transpose([2, 0, 1]).expandDims();
    return batched;
}

export function useSemanticSegmentation(
    handlePredictions: (p: tf.Tensor<tf.Rank>) => Promise<void>
) {
    const model = useRef<tf.LayersModel | null>(null);
    const webcam = useWebcam();

    function detectFrame() {
        if (!webcam || !model.current) {
            return;
        }

        tf.engine().startScope();
        // @todo get crop of image or find different model
        const modelInput = processInput(webcam.canvas);
        const predictions = model.current.predict(modelInput);
        handlePredictions(predictions as tf.Tensor<tf.Rank>);
        tf.engine().endScope();
    }

    useEffect(() => {
        async function loadModel() {
            model.current = await tf.loadLayersModel(
                "/semantic_segmentation/weights/model.json"
            );
        }

        loadModel();
    }, []);

    useFrame(() => {
        detectFrame();
    });
}
