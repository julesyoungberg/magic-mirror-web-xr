// adapted from https://github.com/artcom/react-three-arjs/blob/main/src/ar/arCanvas.js
import React from "react";
import { Canvas, CanvasProps, RootState, events } from "@react-three/fiber";

import { ARProvider, Props as ARProps } from "./ARProvider";
import { UseBoundStore } from "zustand";

function eventManagerFactory(
    state: UseBoundStore<RootState>
): ReturnType<typeof events> {
    return {
        ...events(state),

        compute(event, state) {
            state.pointer.set(
                (event.clientX / state.size.width) * 2 - 1,
                -(event.clientY / state.size.height) * 2 + 1
            );
            state.raycaster.setFromCamera(state.pointer, state.camera);
        },
    };
}

type Props = CanvasProps &
    ARProps & {
        arEnabled?: boolean;
    };

export function ARCanvas({
    arEnabled = true,
    tracking = true,
    children,
    patternRatio = 0.5,
    detectionMode = "mono_and_matrix",
    cameraParametersUrl = "data/camera_para.dat",
    matrixCodeType = "3x3",
    onCameraStreamReady,
    onCameraStreamError,
    sourceParams,
    ...props
}: Props) {
    return (
        <Canvas
            events={eventManagerFactory}
            camera={arEnabled ? { position: [0, 0, 0] } : props.camera}
            {...props}
        >
            {arEnabled ? (
                <ARProvider
                    tracking={tracking}
                    patternRatio={patternRatio}
                    matrixCodeType={matrixCodeType}
                    detectionMode={detectionMode}
                    cameraParametersUrl={cameraParametersUrl}
                    onCameraStreamReady={onCameraStreamReady}
                    onCameraStreamError={onCameraStreamError}
                    sourceParams={sourceParams}
                >
                    {children}
                </ARProvider>
            ) : (
                children
            )}
        </Canvas>
    );
}
