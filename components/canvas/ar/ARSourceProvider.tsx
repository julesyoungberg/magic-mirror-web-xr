import { ArToolkitContext } from "@ar-js-org/ar.js/three.js/build/ar-threex";
import { useFrame, useThree } from "@react-three/fiber";
import React, { createContext, useCallback, useEffect, useMemo } from "react";
import ARSource, { SourceParameters, isVideoElement } from "./Source";

export const ARSourceContext = createContext<{
    arSource?: ARSource;
}>({});

const videoDomElemSelector = "#arjs-video";

type Props = {
    onCameraStreamReady: () => void;
    onCameraStreamError: () => void;
    params: SourceParameters;
};

function _ARSourceProvider({
    children,
    onCameraStreamReady,
    onCameraStreamError,
    params,
}: React.PropsWithChildren<Props>) {
    const { gl, camera } = useThree();
    const arSource = useMemo(() => new ARSource(params), [params]);

    const onResize = useCallback(() => {
        arSource.onResizeElement();
        arSource.copyElementSizeTo(gl.domElement);
    }, [arSource, gl.domElement]);

    const onUnmount = useCallback(() => {
        window.removeEventListener("resize", onResize);

        const video = document.querySelector(videoDomElemSelector);
        if (video) {
            video.srcObject.getTracks().map((track) => track.stop());
            video.remove();
        }
    }, [onResize]);

    useEffect(() => {
        arSource.init(() => {
            const video = document.querySelector(videoDomElemSelector);
            if (!video || !isVideoElement(video)) {
                throw new Error("video not found");
            }

            video.style.position = "fixed";

            video.onloadedmetadata = () => {
                console.log(
                    "actual source dimensions",
                    video.videoWidth,
                    video.videoHeight
                );

                if (onCameraStreamReady) {
                    onCameraStreamReady();
                }

                onResize();
            };
        }, onCameraStreamError);

        window.addEventListener("resize", onResize);

        return onUnmount;
    }, [
        arSource,
        camera,
        onCameraStreamReady,
        onCameraStreamError,
        onResize,
        onUnmount,
    ]);

    return (
        <ARSourceContext.Provider value={arSource}>
            {children}
        </ARSourceContext.Provider>
    );
}

export const ARSourceProivder = React.memo(_ARSourceProvider);
