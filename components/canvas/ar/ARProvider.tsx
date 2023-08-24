// adapted from https://github.com/artcom/react-three-arjs/blob/main/src/ar/ar.js
/* eslint-disable import/named */
import { ArToolkitContext } from "@ar-js-org/ar.js/three.js/build/ar-threex";
import { useThree } from "@react-three/fiber";
import React, { createContext, useCallback, useEffect, useMemo } from "react";
import { ARSourceProivder } from "./ARSourceProvider";
import Source, { SourceParameters } from "./Source";

export const ARContext = createContext<ArToolkitContext | null>(null);

export type Props = React.PropsWithChildren<{
    tracking?: boolean;
    patternRatio: number;
    matrixCodeType: string;
    detectionMode: string;
    cameraParametersUrl: string;
    onCameraStreamReady: () => void;
    onCameraStreamError: () => void;
    sourceParams: SourceParameters;
}>;

function _ARProvider({
    tracking = true,
    children,
    patternRatio,
    matrixCodeType,
    detectionMode,
    cameraParametersUrl,
    onCameraStreamReady,
    onCameraStreamError,
    sourceParams,
}: Props) {
    const { camera } = useThree();

    const arContext = useMemo(() => {
        return new ArToolkitContext({
            cameraParametersUrl,
            detectionMode,
            patternRatio,
            matrixCodeType,
        });
    }, [patternRatio, matrixCodeType, cameraParametersUrl, detectionMode]);

    useEffect(() => {
        arContext.init(() =>
            camera.projectionMatrix.copy(arContext.getProjectionMatrix())
        );

        return () => {
            arContext.arController.dispose();
            if (arContext.arController.cameraParam) {
                arContext.arController.cameraParam.dispose();
            }
        };
    }, [arContext, camera]);

    const wrappedOnCameraStreamReady = useCallback(
        (video: HTMLVideoElement) => {
            if (video.videoWidth > video.videoHeight) {
                arContext.arController.orientation = "landscape";
                arContext.arController.options.orientation = "landscape";
            } else {
                arContext.arController.orientation = "portrait";
                arContext.arController.options.orientation = "portrait";
            }
        },
        [arContext, onCameraStreamReady]
    );

    const onResize = useCallback(
        (arSource: Source) => {
            if (!arContext.arController) {
                return;
            }

            arSource.copyElementSizeTo(arContext.arController.canvas);
            camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        },
        [arContext, camera]
    );

    const onFrame = useCallback(
        (arSource: Source) => {
            if (!tracking) {
                return;
            }

            if (arSource.ready !== false && arSource.domElement) {
                arContext.update(arSource.domElement);
            }
        },
        [arContext]
    );

    return (
        <ARSourceProivder
            onCameraStreamError={onCameraStreamError}
            onCameraStreamReady={wrappedOnCameraStreamReady}
            onFrame={onFrame}
            onResize={onResize}
            params={sourceParams}
        >
            <ARContext.Provider value={arContext}>
                {children}
            </ARContext.Provider>
        </ARSourceProivder>
    );
}

export const ARProvider = React.memo(_ARProvider);
