import * as THREE from "three";
import { Color, MeshProps } from "@react-three/fiber";

export type PlaneProps = MeshProps & {
    color?: Color;
    size?: [number, number];
};

export function Plane({
    color = "grey",
    size = [10, 10],
    ...meshProps
}: PlaneProps) {
    return (
        <mesh
            receiveShadow
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, -1, 0]}
            {...meshProps}
        >
            <planeGeometry attach="geometry" args={size} />
            <meshStandardMaterial
                attach="material"
                color={color}
                args={[{ side: THREE.DoubleSide }]}
            />
        </mesh>
    );
}
