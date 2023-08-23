/* eslint-disable import/named */
import { useWebcam } from "@/hooks/useWebcam";
import {
    ArToolkitContext,
    ArToolkitSource,
} from "@ar-js-org/ar.js/three.js/build/ar-threex";
import { useFrame, useThree } from "@react-three/fiber";
import React, { createContext, useCallback, useEffect, useMemo } from "react";

export const ARContext = createContext<{ arToolkitContext?: ArToolkitContext }>(
    {}
);

const videoDomElemSelector = "#arjs-video";

export type Props = React.PropsWithChildren<{
    tracking?: boolean;
    sourceType: string;
    patternRatio: number;
    matrixCodeType: string;
    detectionMode: string;
    cameraParametersUrl: string;
    onCameraStreamReady: () => void;
    onCameraStreamError: () => void;
}>;

function _ARProvider({
    tracking = true,
    children,
    sourceType,
    patternRatio,
    matrixCodeType,
    detectionMode,
    cameraParametersUrl,
    onCameraStreamReady,
    onCameraStreamError,
}: Props) {
    const webcam = useWebcam();
    const { gl, camera } = useThree();

    const arContext = useMemo(() => {
        //  const arToolkitSource = new ArToolkitSource({ sourceType });
        const arToolkitContext = new ArToolkitContext({
            cameraParametersUrl,
            detectionMode,
            patternRatio,
            matrixCodeType,
        });

        return arToolkitContext; // { arToolkitContext, arToolkitSource };
    }, [
        patternRatio,
        matrixCodeType,
        cameraParametersUrl,
        detectionMode,
        sourceType,
    ]);

    const onResize = useCallback(() => {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(gl.domElement);
        if (arContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arContext.arController.canvas);
            camera.projectionMatrix.copy(arContext.getProjectionMatrix());
        }
    }, [gl, arContext, camera]);

    const onUnmount = useCallback(() => {
        window.removeEventListener("resize", onResize);

        arContext.arController.dispose();
        if (arContext.arController.cameraParam) {
            arContext.arController.cameraParam.dispose();
        }
    }, [onResize, arContext]);

    useEffect(() => {
        arContext.arToolkitSource.init(() => {
            const video = document.querySelector(videoDomElemSelector);
            video.style.position = "fixed";

            video.onloadedmetadata = () => {
                console.log(
                    "actual source dimensions",
                    video.videoWidth,
                    video.videoHeight
                );

                if (video.videoWidth > video.videoHeight) {
                    arContext.arController.orientation = "landscape";
                    arContext.arController.options.orientation = "landscape";
                } else {
                    arContext.arController.orientation = "portrait";
                    arContext.arController.options.orientation = "portrait";
                }

                if (onCameraStreamReady) {
                    onCameraStreamReady();
                }
                onResize();
            };
        }, onCameraStreamError);

        arContext.init(() =>
            camera.projectionMatrix.copy(arContext.getProjectionMatrix())
        );

        window.addEventListener("resize", onResize);

        return onUnmount;
    }, [
        arContext,
        camera,
        onCameraStreamReady,
        onCameraStreamError,
        onResize,
        onUnmount,
    ]);

    useFrame(() => {
        if (!tracking) {
            return;
        }

        if (
            arContext.arToolkitSource &&
            arContext.arToolkitSource.ready !== false
        ) {
            arContext.update(arContext.arToolkitSource.domElement);
        }
    });

    const value = useMemo(() => ({ arToolkitContext: arContext }), [arContext]);

    return <ARContext.Provider value={value}>{children}</ARContext.Provider>;
}

export const ARProvider = React.memo(_ARProvider);
