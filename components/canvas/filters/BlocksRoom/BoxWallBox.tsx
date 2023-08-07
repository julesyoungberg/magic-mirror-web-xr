import { CanvasTexture } from "@/hooks/useCanvasTexture";
import { Box, BoxProps } from "../../primitives/Box";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { StandardMaterialProps } from "../../primitives/StandardMaterial";

type Props = Omit<BoxProps, "meshRef"> & {
    colIdx: number;
    rowIdx: number;
    depthMap: CanvasTexture;
    materialProps?: StandardMaterialProps;
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

        const prevScale = ref.current.scale.z;
        const nextScale = brightness * 7 + 1;
        const blend = 0.2;

        ref.current.scale.set(
            1,
            1,
            nextScale * blend + prevScale * (1 - blend)
        );
    });

    return <Box {...boxProps} meshRef={ref} />;
}
