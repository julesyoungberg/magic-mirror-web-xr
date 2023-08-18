import { ARMarker } from "@artcom/react-three-arjs";

export function ARDemo() {
    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 0]} />
            <ARMarker type="pattern" patternUrl="data/hiro.patt">
                <mesh>
                    <boxBufferGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="green" />
                </mesh>
            </ARMarker>
        </>
    );
}
