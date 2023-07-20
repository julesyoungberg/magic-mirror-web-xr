"use client";

import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";
import { useCallback, useRef } from "react";
import Webcam from "react-webcam";

import ConditionalWrapper from "../helpers/ConditionalWrapper";
import XRWrapper from "./XRWrapper";
import { SceneInner } from "./SceneInner";

export default function Scene() {
    // @todo check for support
    const supportsXR = true;

    const webcamRef = useRef<any>(null);
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
    }, [webcamRef]);

    return (
        <div style={{ width: "100%", aspectRatio: 16 / 9 }}>
            {supportsXR && <ARButton />}
            {false && (
                <Webcam
                    audio={false}
                    height={720}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={1280}
                    videoConstraints={{
                        width: 1280,
                        height: 720,
                        facingMode: "environment",
                    }}
                    onUserMedia={(stream) => {
                        console.log(stream);
                    }}
                />
            )}
            <Canvas>
                <ConditionalWrapper
                    predicate={supportsXR}
                    wrapper={(children) => <XRWrapper>{children}</XRWrapper>}
                >
                    <SceneInner />
                </ConditionalWrapper>
            </Canvas>
        </div>
    );
}
