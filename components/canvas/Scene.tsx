"use client";

import { ARButton } from "@react-three/xr";
import { Suspense, useEffect, useState } from "react";

import ConditionalWrapper from "../helpers/ConditionalWrapper";
import XRWrapper from "./XRWrapper";
import { SceneInner } from "./SceneInner";
import WebcamProvider from "./WebcamProvider";
import FrameProcessor from "./FrameProcessor";
import { DEFAULT_SCENE } from "./scenes";
import { Canvas } from "./Canvas";

export default function Scene() {
    const scene = DEFAULT_SCENE;
    // @todo check for support
    const supportsXR = false; // true;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(typeof window !== "undefined");
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            {supportsXR && <ARButton />}
            <Canvas scene={scene}>
                <WebcamProvider>
                    <ConditionalWrapper
                        predicate={supportsXR}
                        wrapper={(children) => (
                            <XRWrapper>{children}</XRWrapper>
                        )}
                    >
                        <Suspense>
                            <SceneInner scene={scene} />
                            <FrameProcessor scene={scene} />
                        </Suspense>
                    </ConditionalWrapper>
                </WebcamProvider>
            </Canvas>
        </div>
    );
}
