import { useFrame } from "@react-three/fiber";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import { useEffect, useRef, useState } from "react";
import "@tensorflow/tfjs-backend-webgl";
import { useWebcam } from "./useWebcam";

export type BodyPixConfig = {
    maxDetections?: number;
    scoreThreshold?: number;
    nmsRadius?: number;
    minKeypointScore?: number;
    refineSteps?: number;
};

export function useBodyPix(
    onResults: (results: bodyPix.PartSegmentation[]) => void,
    config?: BodyPixConfig
) {
    const webcam = useWebcam();
    const [net, setNet] = useState<bodyPix.BodyPix | undefined>(undefined);
    const processing = useRef<boolean>(false);

    useEffect(() => {
        async function loadNet() {
            await tf.ready();
            setNet(await bodyPix.load());
        }

        loadNet();
    }, []);

    useFrame(() => {
        async function segment() {
            if (!webcam || !net || processing.current) {
                return;
            }

            processing.current = true;

            try {
                const result = await net.segmentMultiPersonParts(
                    webcam.canvas,
                    config
                );

                onResults(result);
            } catch (e) {
                // oops
            } finally {
                processing.current = false;
            }
        }

        segment();
    });

    return null;
}
