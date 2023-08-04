import React, { forwardRef } from "react";
import { Color, MeshProps } from "@react-three/fiber";

export type BoxProps = MeshProps & {
    color?: Color;
    size?: [number, number, number];
};

export function Box({
    color = "grey",
    size = [1, 1, 1],
    ...meshProps
}: BoxProps) {
    return (
        <mesh castShadow receiveShadow {...meshProps}>
            <boxGeometry args={size} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    );
}

export default forwardRef(Box);
