import { MeshProps } from "@react-three/fiber";
import { MutableRefObject } from "react";
import { StandardMaterial } from "./StandardMaterial";

export type BoxProps = MeshProps & {
    size?: [number, number, number];
    meshRef?: MutableRefObject<THREE.Mesh | null>;
    materialNode?: JSX.Element;
};

export function Box({
    size = [1, 1, 1],
    meshRef,
    materialNode,
    ...meshProps
}: BoxProps) {
    return (
        <mesh castShadow receiveShadow ref={meshRef} {...meshProps}>
            <boxGeometry args={size} />
            {materialNode || <StandardMaterial />}
        </mesh>
    );
}
