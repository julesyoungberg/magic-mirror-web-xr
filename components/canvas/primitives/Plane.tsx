import { MeshProps } from "@react-three/fiber";
import { StandardMaterial, StandardMaterialProps } from "./StandardMaterial";

export type PlaneProps = MeshProps & {
    size?: [number, number];
    materialNode?: JSX.Element;
};

export function Plane({
    size = [10, 10],
    materialNode,
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
            {materialNode || <StandardMaterial />}
        </mesh>
    );
}
