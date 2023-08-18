/* eslint-disable import/named */
/* eslint-disable no-underscore-dangle */
import { ArMarkerControls } from "@ar-js-org/ar.js/three.js/build/ar-threex";
import { useFrame } from "@react-three/fiber";
import { useAR } from "@/hooks/useAR";
import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";

type Props = React.PropsWithChildren<{
    type: string;
    barcodeValue: string;
    patternUrl: string;
    params: Object;
    onMarkerFound: () => void;
    onMarkerLost: () => void;
}>;

export function ARMarker({
    children,
    type,
    barcodeValue,
    patternUrl,
    params,
    onMarkerFound,
    onMarkerLost,
}: Props) {
    const markerRoot = useRef<THREE.Group | null>(null);
    const { arToolkitContext } = useAR();
    const [isFound, setIsFound] = useState(false);

    useEffect(() => {
        if (!arToolkitContext || !markerRoot.current) {
            return;
        }

        const markerControls = new ArMarkerControls(
            arToolkitContext,
            markerRoot.current,
            {
                type,
                barcodeValue: type === "barcode" ? barcodeValue : null,
                patternUrl: type === "pattern" ? patternUrl : null,
                ...params,
            }
        );

        return () => {
            const index =
                arToolkitContext._arMarkersControls.indexOf(markerControls);
            arToolkitContext._arMarkersControls.splice(index, 1);
        };
    }, []);

    useFrame(() => {
        if (markerRoot.current?.visible && !isFound) {
            setIsFound(true);
            if (onMarkerFound) {
                onMarkerFound();
            }
        } else if (!markerRoot.current?.visible && isFound) {
            setIsFound(false);
            if (onMarkerLost) {
                onMarkerLost();
            }
        }
    });

    return <group ref={markerRoot}>{children}</group>;
}
