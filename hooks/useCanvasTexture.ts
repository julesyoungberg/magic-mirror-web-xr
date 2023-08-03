import { useMemo } from "react";
import * as THREE from "three";

export type CanvasTextureConfig = {
    width: number;
    height: number;
};

export function initCanvasTexture({ width, height }: CanvasTextureConfig) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        throw new Error("failed to get 2d canvas context");
    }
    canvasCtx.fillStyle = "#000000";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { canvas, canvasCtx, texture };
}

export type CanvasTexture = ReturnType<typeof initCanvasTexture>;

export function useCanvasTexture({ width, height }: CanvasTextureConfig) {
    const canvasTexture = useMemo(() => {
        return initCanvasTexture({ width, height });
    }, [width, height]);

    return canvasTexture;
}
