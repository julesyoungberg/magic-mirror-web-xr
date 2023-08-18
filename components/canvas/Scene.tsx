"use client";

import { ARCanvas, ARMarker } from "@artcom/react-three-arjs";
import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";

import ConditionalWrapper from "../helpers/ConditionalWrapper";
import XRWrapper from "./XRWrapper";
import { SceneInner } from "./SceneInner";
import WebcamProvider from "./WebcamProvider";
import FrameProcessor from "./FrameProcessor";
import { DEFAULT_SCENE } from "./scenes";

export default function Scene() {
    const scene = DEFAULT_SCENE;
    // @todo check for support
    const supportsXR = true;

    return (
        <div style={{ width: "100%", aspectRatio: 16 / 9 }}>
            {supportsXR && <ARButton />}
            <ARCanvas>
                <WebcamProvider>
                    <ConditionalWrapper
                        predicate={supportsXR}
                        wrapper={(children) => (
                            <XRWrapper>{children}</XRWrapper>
                        )}
                    >
                        <SceneInner scene={scene} />
                        <FrameProcessor />
                    </ConditionalWrapper>
                </WebcamProvider>
            </ARCanvas>
        </div>
    );
}
