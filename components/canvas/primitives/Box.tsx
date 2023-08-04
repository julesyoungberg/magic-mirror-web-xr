import React, { MutableRefObject } from "react";
import { Color, MeshProps } from "@react-three/fiber";

export type BoxProps = MeshProps & {
    color?: Color;
    size?: [number, number, number];
    meshRef?: MutableRefObject<THREE.Mesh | null>;
};

export function Box({
    color = "grey",
    size = [1, 1, 1],
    meshRef,
    ...meshProps
}: BoxProps) {
    return (
        <mesh castShadow receiveShadow ref={meshRef} {...meshProps}>
            <boxGeometry args={size} />
            <meshStandardMaterial attach="material" color={color} />
        </mesh>
    );
}
