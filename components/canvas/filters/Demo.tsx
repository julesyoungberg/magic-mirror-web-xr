import * as THREE from "three";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@/hooks/useGLTF";
import { useThree } from "@react-three/fiber";
import { useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import { Background } from "../Background";

const blendshapesMap = {
    browDownLeft: "browDown_L",
    browDownRight: "browDown_R",
    browInnerUp: "browInnerUp",
    browOuterUpLeft: "browOuterUp_L",
    browOuterUpRight: "browOuterUp_R",
    cheekPuff: "cheekPuff",
    cheekSquintLeft: "cheekSquint_L",
    cheekSquintRight: "cheekSquint_R",
    eyeBlinkLeft: "eyeBlink_L",
    eyeBlinkRight: "eyeBlink_R",
    eyeLookDownLeft: "eyeLookDown_L",
    eyeLookDownRight: "eyeLookDown_R",
    eyeLookInLeft: "eyeLookIn_L",
    eyeLookInRight: "eyeLookIn_R",
    eyeLookOutLeft: "eyeLookOut_L",
    eyeLookOutRight: "eyeLookOut_R",
    eyeLookUpLeft: "eyeLookUp_L",
    eyeLookUpRight: "eyeLookUp_R",
    eyeSquintLeft: "eyeSquint_L",
    eyeSquintRight: "eyeSquint_R",
    eyeWideLeft: "eyeWide_L",
    eyeWideRight: "eyeWide_R",
    jawForward: "jawForward",
    jawLeft: "jawLeft",
    jawOpen: "jawOpen",
    jawRight: "jawRight",
    mouthClose: "mouthClose",
    mouthDimpleLeft: "mouthDimple_L",
    mouthDimpleRight: "mouthDimple_R",
    mouthFrownLeft: "mouthFrown_L",
    mouthFrownRight: "mouthFrown_R",
    mouthFunnel: "mouthFunnel",
    mouthLeft: "mouthLeft",
    mouthLowerDownLeft: "mouthLowerDown_L",
    mouthLowerDownRight: "mouthLowerDown_R",
    mouthPressLeft: "mouthPress_L",
    mouthPressRight: "mouthPress_R",
    mouthPucker: "mouthPucker",
    mouthRight: "mouthRight",
    mouthRollLower: "mouthRollLower",
    mouthRollUpper: "mouthRollUpper",
    mouthShrugLower: "mouthShrugLower",
    mouthShrugUpper: "mouthShrugUpper",
    mouthSmileLeft: "mouthSmile_L",
    mouthSmileRight: "mouthSmile_R",
    mouthStretchLeft: "mouthStretch_L",
    mouthStretchRight: "mouthStretch_R",
    mouthUpperUpLeft: "mouthUpperUp_L",
    mouthUpperUpRight: "mouthUpperUp_R",
    noseSneerLeft: "noseSneer_L",
    noseSneerRight: "noseSneer_R",
};

// based on https://github.com/mrdoob/three.js/blob/master/examples/webgl_morphtargets_webcam.html
export function Demo() {
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
            transform.matrix.scale(new THREE.Vector3(2, 2, 2));
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
            <primitive object={gltf.scene} />
        </>
    );
}
