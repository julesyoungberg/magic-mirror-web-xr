import * as THREE from "three";
import React, { useLayoutEffect } from "react";
import { useGLTF } from "@/hooks/useGLTF";

const material = new THREE.MeshNormalMaterial();

type Props = {
    groupRef: any;
    meshRef: any;
    [key: string]: any;
};

export function HeadModel({ groupRef, meshRef, ...props }: Props) {
    const { nodes } = useGLTF("./models/gltf/facecap.glb");

    useLayoutEffect(() => {
        if (!meshRef.current) {
            return;
        }

        meshRef.current.scale.set(nodes.mesh_2.scale);
        meshRef.current.morphTargetDictionary =
            nodes.mesh_2.morphTargetDictionary;
        meshRef.current.morphTargetInfluences =
            nodes.mesh_2.morphTargetInfluences;
        meshRef.current.updateMorphTargets();
    }, [nodes, meshRef.current]);

    console.log(nodes.mesh_2);

    return (
        <group scale={2} {...props} ref={groupRef} dispose={null}>
            <mesh
                ref={meshRef}
                geometry={nodes.mesh_2.geometry}
                material={material}
            />
        </group>
    );
}
