import { useFrame, useThree } from "@react-three/fiber";
import React, { createContext, useCallback, useEffect, useMemo } from "react";
import ARSource, { SourceParameters, isVideoElement } from "./Source";
import Source from "./Source";

export const ARSourceContext = createContext<ARSource | null>(null);

const videoDomElemSelector = "#arjs-video";

type Props = {
    onCameraStreamReady?: (video: HTMLVideoElement) => void;
    onCameraStreamError: () => void;
    onFrame?: (source: Source) => void;
    onResize?: (source: Source) => void;
    params: SourceParameters;
};

function _ARSourceProvider({
    children,
    onCameraStreamReady,
    onCameraStreamError,
    onFrame,
    onResize: onResizeCallback,
    params,
}: React.PropsWithChildren<Props>) {
    const { gl, camera } = useThree();
    const arSource = useMemo(() => new ARSource(params), [params]);

    const onResize = useCallback(() => {
        arSource.onResizeElement();
        arSource.copyElementSizeTo(gl.domElement);
        onResizeCallback?.(arSource);
    }, [arSource, gl.domElement, onResizeCallback]);

    const onUnmount = useCallback(() => {
        window.removeEventListener("resize", onResize);

        const video = document.querySelector(videoDomElemSelector);
        if (video) {
            (video as any).srcObject
                ?.getTracks()
                .map((track: any) => track.stop());
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
                    onCameraStreamReady(video);
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

    useFrame(() => {
        onFrame?.(arSource);
    });

    return (
        <ARSourceContext.Provider value={arSource}>
            {children}
        </ARSourceContext.Provider>
    );
}

export const ARSourceProivder = React.memo(_ARSourceProvider);
