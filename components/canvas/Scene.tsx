"use client";

import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";

import ConditionalWrapper from "../helpers/ConditionalWrapper";
import XRWrapper from "./XRWrapper";
import { SceneInner } from "./SceneInner";
import WebcamProvider from "./WebcamProvider";

export default function Scene() {
    // @todo check for support
    const supportsXR = true;

    return (
        <div style={{ width: "100%", aspectRatio: 16 / 9 }}>
            {supportsXR && <ARButton />}
            <Canvas>
                <WebcamProvider>
                    <ConditionalWrapper
                        predicate={supportsXR}
                        wrapper={(children) => (
                            <XRWrapper>{children}</XRWrapper>
                        )}
                    >
                        <SceneInner />
                    </ConditionalWrapper>
                </WebcamProvider>
            </Canvas>
        </div>
    );
}
