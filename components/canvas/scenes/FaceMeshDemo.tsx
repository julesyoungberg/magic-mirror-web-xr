import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@/hooks/useGLTF";
import { useThree } from "@react-three/fiber";
import { blendshapesMap, useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import { Background } from "../Background";

// based on https://github.com/mrdoob/three.js/blob/master/examples/webgl_morphtargets_webcam.html
export function FaceMeshDemo() {
    const webcam = useWebcam();
    const { scene } = useThree();

    const gltf = useGLTF("./models/gltf/facecap.glb");
    console.log(gltf);

    useEffect(() => {
        const mesh = gltf.scene.children[0];
        console.log({ mesh });

        const head = mesh.getObjectByName("mesh_2");
        console.log({ head });

        if (!head) {
            return;
        }

        (head as any).material = new THREE.MeshNormalMaterial();
    }, [gltf]);

    const transform = useMemo(() => new THREE.Object3D(), []);

    useFaceLandmarks((results) => {
        console.log(results);
        if (results.facialTransformationMatrixes.length > 0) {
            const facialTransformationMatrixes =
                results.facialTransformationMatrixes[0].data;
            transform.matrix.fromArray(facialTransformationMatrixes);
            transform.matrix.decompose(
                transform.position,
                transform.quaternion,
                transform.scale
            );
            const object = scene.getObjectByName("grp_transform");
            if (object) {
                object.position.x = transform.position.x;
                object.position.y = transform.position.z + 40;
                object.position.z = -transform.position.y;
                object.rotation.x = transform.rotation.x;
                object.rotation.y = transform.rotation.z;
                object.rotation.z = -transform.rotation.y;
            }
        }

        if (results.faceBlendshapes.length > 0) {
            const face = scene.getObjectByName("mesh_2");
            if (face) {
                const faceBlendshapes = results.faceBlendshapes[0].categories;
                for (const blendshape of faceBlendshapes) {
                    const categoryName = blendshape.categoryName;
                    const score = blendshape.score;
                    const index =
                        face.morphTargetDictionary[
                            blendshapesMap[categoryName]
                        ];
                    if (index !== undefined) {
                        face.morphTargetInfluences[index] = score;
                    }
                }
            }
        }
    });

    return (
        <>
            {webcam && <Background texture={webcam.texture} />}
            <primitive object={gltf.scene} scale={2.0} />
        </>
    );
}
