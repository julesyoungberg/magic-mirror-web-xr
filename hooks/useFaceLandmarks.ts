import { useEffect, useRef, useState } from "react";
import { useWebcam } from "./useWebcam";
import {
    FaceLandmarker,
    FaceLandmarkerResult,
    FilesetResolver,
} from "@mediapipe/tasks-vision";
import { useFrame } from "@react-three/fiber";

export const blendshapesMap = {
    browDownLeft: "browDown_L",
    browDownRight: "browDown_R",
    browInnerUp: "browInnerUp",
    browOuterUpLeft: "browOuterUp_L",
    browOuterUpRight: "browOuterUp_R",
    cheekPuff: "cheekPuff",
    cheekSquintLeft: "cheekSquint_L",
    cheekSquintRight: "cheekSquint_R",
    eyeBlinkLeft: "eyeBlink_L",
    eyeBlinkRight: "eyeBlink_R",
    eyeLookDownLeft: "eyeLookDown_L",
    eyeLookDownRight: "eyeLookDown_R",
    eyeLookInLeft: "eyeLookIn_L",
    eyeLookInRight: "eyeLookIn_R",
    eyeLookOutLeft: "eyeLookOut_L",
    eyeLookOutRight: "eyeLookOut_R",
    eyeLookUpLeft: "eyeLookUp_L",
    eyeLookUpRight: "eyeLookUp_R",
    eyeSquintLeft: "eyeSquint_L",
    eyeSquintRight: "eyeSquint_R",
    eyeWideLeft: "eyeWide_L",
    eyeWideRight: "eyeWide_R",
    jawForward: "jawForward",
    jawLeft: "jawLeft",
    jawOpen: "jawOpen",
    jawRight: "jawRight",
    mouthClose: "mouthClose",
    mouthDimpleLeft: "mouthDimple_L",
    mouthDimpleRight: "mouthDimple_R",
    mouthFrownLeft: "mouthFrown_L",
    mouthFrownRight: "mouthFrown_R",
    mouthFunnel: "mouthFunnel",
    mouthLeft: "mouthLeft",
    mouthLowerDownLeft: "mouthLowerDown_L",
    mouthLowerDownRight: "mouthLowerDown_R",
    mouthPressLeft: "mouthPress_L",
    mouthPressRight: "mouthPress_R",
    mouthPucker: "mouthPucker",
    mouthRight: "mouthRight",
    mouthRollLower: "mouthRollLower",
    mouthRollUpper: "mouthRollUpper",
    mouthShrugLower: "mouthShrugLower",
    mouthShrugUpper: "mouthShrugUpper",
    mouthSmileLeft: "mouthSmile_L",
    mouthSmileRight: "mouthSmile_R",
    mouthStretchLeft: "mouthStretch_L",
    mouthStretchRight: "mouthStretch_R",
    mouthUpperUpLeft: "mouthUpperUp_L",
    mouthUpperUpRight: "mouthUpperUp_R",
    noseSneerLeft: "noseSneer_L",
    noseSneerRight: "noseSneer_R",
};

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
