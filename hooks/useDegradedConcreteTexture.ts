import { useTexture } from "@react-three/drei";

export function useDegradedConcreteTexture() {
    const getPath = (dataType: string) =>
        `./textures/degraded-concreate/degraded-concrete_${dataType}.png`;

    return useTexture({
        map: getPath("albedo"),
        displacementMap: getPath("height"),
        normalMap: getPath("normal-dx"),
        roughnessMap: getPath("roughness"),
        aoMap: getPath("ao"),
        metalnessMap: getPath("metalness"),
    });
}
