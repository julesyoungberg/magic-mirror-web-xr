import { CanvasTexture } from "@/hooks/useCanvasTexture";
import Box, { BoxProps } from "../../primitives/Box";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = BoxProps & {
    colIdx: number;
    rowIdx: number;
    depthMap: CanvasTexture;
};

// @todo debug / fix
export function BoxWallBox({ colIdx, rowIdx, depthMap, ...boxProps }: Props) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame(() => {
        if (!ref.current) {
            return;
        }

        const pixel = depthMap.canvasCtx.getImageData(colIdx, rowIdx, 1, 1);

        const brightness = (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3;

        ref.current.scale.set(1, 1, brightness);
    });

    return <Box {...boxProps} ref={ref} />;
}
