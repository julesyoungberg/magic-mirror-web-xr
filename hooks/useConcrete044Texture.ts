import { useTexture } from "@react-three/drei";

export function useConcrete044Texture() {
    const getPath = (dataType: string) =>
        `./textures/Concrete044D_4K-JPG/Concrete044D_4K_${dataType}.png`;

    // @todo fix paths
    return useTexture({
        map: getPath("Color"),
        displacementMap: getPath("Displacement"),
        normalMap: getPath("NormalDX"),
        roughnessMap: getPath("Roughness"),
        aoMap: getPath("AmbientOcclusion"),
        metalnessMap: getPath("Metalness"),
    });
}
