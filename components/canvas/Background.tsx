import * as THREE from "three";

type Props = {
    texture: THREE.Texture;
};

export function Background({ texture }: Props) {
    return <primitive attach="background" object={texture} />;
}
