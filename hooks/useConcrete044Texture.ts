import { useTexture } from "@react-three/drei";

export function useConcrete044Texture() {
    const getPath = (dataType: string) =>
        `./textures/Concrete044D_4K-JPG/Concrete044D_4K_${dataType}.png`;

    // @todo fix paths
    return useTexture({
        map: getPath("albedo"),
        displacementMap: getPath("height"),
        normalMap: getPath("normal-dx"),
        roughnessMap: getPath("roughness"),
        aoMap: getPath("ao"),
        metalnessMap: getPath("metalness"),
    });
}
