import { ARMarker } from "../ar/ARMarker";

export function ARDemo() {
    return (
        <>
            <ambientLight />
            <pointLight position={[10, 10, 0]} />
            <ARMarker
                type="pattern"
                patternUrl="data/patt.hiro"
                onMarkerFound={() => {
                    console.log("Marker Found");
                }}
            >
                <mesh>
                    <boxGeometry attach="geometry" args={[1, 1, 1]} />
                    <meshStandardMaterial attach="material" color="green" />
                </mesh>
            </ARMarker>
        </>
    );
}
