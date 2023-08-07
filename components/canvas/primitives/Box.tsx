import React, { MutableRefObject } from "react";
import { MeshProps } from "@react-three/fiber";
import { StandardMaterial, StandardMaterialProps } from "./StandardMaterial";

export type BoxProps = MeshProps & {
    size?: [number, number, number];
    meshRef?: MutableRefObject<THREE.Mesh | null>;
    materialProps?: StandardMaterialProps;
};

export function Box({
    size = [1, 1, 1],
    meshRef,
    materialProps,
    ...meshProps
}: BoxProps) {
    return (
        <mesh castShadow receiveShadow ref={meshRef} {...meshProps}>
            <boxGeometry args={size} />
            <StandardMaterial {...materialProps} />
        </mesh>
    );
}
