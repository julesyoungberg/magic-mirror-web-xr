import { useFrame } from "@react-three/fiber";
import { useCanvasTexture } from "./useCanvasTexture";

export function useDownsamplingCanvas(
    sourceCanvas: HTMLCanvasElement | undefined,
    targetWidth: number,
    targetHeight: number
) {
    const canvasTexture = useCanvasTexture({
        width: targetWidth,
        height: targetHeight,
    });

    useFrame(() => {
        if (!sourceCanvas) {
            return;
        }

        canvasTexture.canvasCtx.drawImage(
            sourceCanvas,
            0,
            0,
            targetWidth,
            targetHeight
        );
        canvasTexture.texture.needsUpdate = true;
    });

    return canvasTexture;
}
