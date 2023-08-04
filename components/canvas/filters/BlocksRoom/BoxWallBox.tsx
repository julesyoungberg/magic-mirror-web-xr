import { CanvasTexture } from "@/hooks/useCanvasTexture";
import { Box, BoxProps } from "../../primitives/Box";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

type Props = Omit<BoxProps, "meshRef"> & {
    colIdx: number;
    rowIdx: number;
    depthMap: CanvasTexture;
};

export function BoxWallBox({ colIdx, rowIdx, depthMap, ...boxProps }: Props) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame(() => {
        if (!ref.current) {
            return;
        }

        const pixel = depthMap.canvasCtx.getImageData(colIdx, rowIdx, 1, 1);

        const brightness =
            (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3 / 255;

        ref.current.scale.set(1, 1, brightness * 10 + 1);
    });

    return <Box {...boxProps} meshRef={ref} />;
}
