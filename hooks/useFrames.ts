import { useMemo } from "react";
import * as THREE from "three";

export function getFrame(
    width: number,
    height: number,
    options?: THREE.WebGLRenderTargetOptions
) {
    return new THREE.WebGLRenderTarget(width, height, {
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        ...options,
    });
}

export function useFrames(
    n: number,
    width: number,
    height: number,
    options?: THREE.WebGLRenderTargetOptions
) {
    return useMemo(() => {
        return new Array(n).fill(0).map(() => getFrame(width, height, options));
    }, [n, width, height, options]);
}
