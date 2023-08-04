import { MeshProps } from "@react-three/fiber";

export function Bulb(props: MeshProps) {
    return (
        <mesh {...props}>
            <pointLight castShadow />
            <sphereBufferGeometry args={[1]} />
            <meshPhongMaterial emissive="white" emissiveIntensity={100} />
        </mesh>
    );
}
