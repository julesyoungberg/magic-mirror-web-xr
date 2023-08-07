import { useFlakingLimestoneTexture } from "@/hooks/useFlakingLimestoneTexture";
import { Plane } from "../../primitives/Plane";
import { BoxWall } from "./BoxWall";
import { StandardMaterial } from "../../primitives/StandardMaterial";

export function BlocksRoom() {
    const halfRoomHeight = 2.5;
    const halfRoomWidth = 4.44;

    const texture = useFlakingLimestoneTexture();

    const material = <StandardMaterial {...texture} />;

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight color="white" position={[0, 1, 3]} />

            {/* Floor */}
            <Plane
                position={[0, -halfRoomHeight, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                materialNode={material}
            />

            {/* Ceiling */}
            <Plane
                position={[0, halfRoomHeight, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                materialNode={material}
            />

            {/* Left Wall */}
            <Plane
                position={[-halfRoomWidth, 0, 0]}
                rotation={[0, Math.PI / 2, 0]}
                materialNode={material}
            />

            {/* Right Wall */}
            <Plane
                position={[halfRoomWidth, 0, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                materialNode={material}
            />

            {/* Back Wall */}
            {/* <Plane position={[0, 0, 0]} rotation={[0, 0, 0]} /> */}
            <BoxWall
                columns={64}
                rows={36}
                roomHeight={halfRoomHeight * 2}
                roomWidth={halfRoomWidth * 2}
                position={[0, 2, 0.5]}
                materialNode={material}
            />
        </>
    );
}
