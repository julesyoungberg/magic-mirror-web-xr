import { useEffect, useRef, useState } from "react";
import { useWebcam } from "./useWebcam";
import {
    FaceLandmarker,
    FaceLandmarkerResult,
    FilesetResolver,
} from "@mediapipe/tasks-vision";
import { useFrame } from "@react-three/fiber";

export function useFaceLandmarks(
    onResults: (results: FaceLandmarkerResult) => void
) {
    const webcam = useWebcam();
    const processing = useRef<boolean>(false);
    const [landmarker, setLandmarker] = useState<FaceLandmarker | undefined>(
        undefined
    );

    useEffect(() => {
        async function load() {
            const filesetResolver = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            );

            const faceLandmarker = await FaceLandmarker.createFromOptions(
                filesetResolver,
                {
                    baseOptions: {
                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU",
                    },
                    outputFaceBlendshapes: true,
                    outputFacialTransformationMatrixes: true,
                    runningMode: "VIDEO",
                    numFaces: 2,
                }
            );

            setLandmarker(faceLandmarker);
        }

        load();
    }, []);

    useFrame(() => {
        if (processing.current || !webcam || !landmarker) {
            return;
        }

        const results = landmarker.detectForVideo(webcam.canvas, Date.now());

        onResults(results);
    });
}
