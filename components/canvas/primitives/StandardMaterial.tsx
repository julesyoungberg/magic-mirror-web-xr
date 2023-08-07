import * as THREE from "three";
import { MeshStandardMaterialProps } from "@react-three/fiber";

export type StandardMaterialProps = MeshStandardMaterialProps;

export function StandardMaterial(props: MeshStandardMaterialProps) {
    return (
        <>
            <meshStandardMaterial
                attach="material"
                color="grey"
                args={[{ side: THREE.DoubleSide }]}
                {...props}
            />
        </>
    );
}
