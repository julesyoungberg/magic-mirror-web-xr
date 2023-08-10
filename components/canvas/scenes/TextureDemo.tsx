import { useDegradedConcreteTexture } from "@/hooks/useDegradedConcreteTexture";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { Box } from "../primitives/Box";
import { StandardMaterial } from "../primitives/StandardMaterial";

export function TextureDemo() {
    const boxRef = useRef<THREE.Mesh | null>(null);
    const boxTexture = useDegradedConcreteTexture();

    useFrame(() => {
        if (!boxRef.current) {
            return;
        }

        boxRef.current.rotation.y += 0.01;
        boxRef.current.rotation.x += 0.003;
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight color="white" position={[0, 1, 3]} />

            <Box
                materialNode={<StandardMaterial {...boxTexture} />}
                meshRef={boxRef}
                scale={[2, 2, 2]}
            />
        </>
    );
}
