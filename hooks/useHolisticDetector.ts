import * as mpHolistic from "@mediapipe/holistic";
import { useWebcam } from "./useWebcam";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const config = {
    locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@` +
        `${mpHolistic.VERSION}/${file}`,
};

export function useHolisticDetector(
    onResults: (results: mpHolistic.Results) => void
) {
    const webcam = useWebcam();
    const processing = useRef<boolean>(false);

    const holistic = useMemo(() => {
        const h = new mpHolistic.Holistic(config);
        h.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableFaceGeometry: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            //mrefineFaceLandmarks: true, // doesn't work with enableFaceGeometry
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });
        h.onResults(onResults);
        return h;
    }, [config, onResults]);

    useFrame(() => {
        if (processing.current) {
            return;
        }

        async function processFrame() {
            if (!webcam) {
                return;
            }

            processing.current = true;

            await holistic.send({ image: webcam.canvas });

            processing.current = false;
        }

        processFrame();
    });

    return null;
}
