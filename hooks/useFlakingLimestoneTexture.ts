import { useTexture } from "@react-three/drei";

export function useFlakingLimestoneTexture() {
    const getPath = (dataType: string) =>
        `./textures/flaking-limestone1/flaking-limestone1-${dataType}.png`;

    return useTexture({
        map: getPath("albedo"),
        displacementMap: getPath("height2"),
        normalMap: getPath("normal"),
        roughnessMap: getPath("roughness"),
        aoMap: getPath("ao"),
        metalnessMap: getPath("metalness"),
    });
}
