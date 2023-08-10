import { CanvasTexture } from "@/hooks/useCanvasTexture";
import { Box, BoxProps } from "../../primitives/Box";
import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useRef } from "react";

type Props = Omit<BoxProps, "meshRef"> & {
    colIdx: number;
    columns: number;
    rowIdx: number;
    rows: number;
    depthMap: CanvasTexture;
    materialNde?: JSX.Element;
};

export function BoxWallBox({
    colIdx,
    columns,
    rowIdx,
    rows,
    depthMap,
    ...boxProps
}: Props) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame(() => {
        if (!ref.current) {
            return;
        }

        const pixel = depthMap.canvasCtx.getImageData(colIdx, rowIdx, 1, 1);

        const brightness =
            (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3 / 255;

        const prevScale = ref.current.scale.z;
        const nextScale = brightness * brightness * 15 + 1;
        const blend = 0.2;

        ref.current.scale.set(
            1,
            1,
            nextScale * blend + prevScale * (1 - blend)
        );
    });

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }

        const x0 = colIdx / columns;
        const x1 = (colIdx + 1) / columns;
        const y0 = rowIdx / rows;
        const y1 = (rowIdx + 1) / rows;

        const { uv } = ref.current.geometry.attributes;

        for (let i = 0; i < uv.count; i++) {
            const u = uv.getX(i);
            const v = uv.getY(i);

            uv.setX(i, [x0, x1][u]);
            uv.setY(i, [y0, y1][v]);
        }
    }, [ref.current]);

    return <Box {...boxProps} meshRef={ref} />;
}
