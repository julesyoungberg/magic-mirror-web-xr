// @todo falling shapes with physics
import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@/hooks/useGLTF";
import { useFrame, useThree } from "@react-three/fiber";
import { blendshapesMap, useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import {
    InstancedRigidBodies,
    Physics,
    RapierRigidBody,
    RigidBody,
} from "@react-three/rapier";
import niceColors from "nice-color-palettes";
import { Background } from "../../Background";

// number of shapes to create each frame
const N_SHAPES = 1;
const MAX_SHAPES = 1;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colorArray = niceColors[17].map((c) => tempColor.set(c).toArray());

type Shape = {
    live: boolean;
    position: [number, number, number];
    rotation: [number, number, number];
    color: number[];
};

const initialShapes = new Array(MAX_SHAPES).fill(0).map(() => ({
    live: false,
    position: [0, 5, 0],
    rotation: [1, 0, 0], // Math.random(), Math.random(), Math.random()],
    color: colorArray[Math.floor(Math.random() * colorArray.length)],
}));

export function GeometricRain() {
    const webcam = useWebcam();
    const { scene } = useThree();
    const faceDetected = useRef(false);
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null);

    const gltf = useGLTF("./models/gltf/facecap.glb");

    useEffect(() => {
        const mesh = gltf.scene.children[0];

        for (const name of ["mesh_0", "mesh_1", "mesh_2", "mesh_3"]) {
            const obj = mesh.getObjectByName(name);

            if (!obj) {
                return;
            }

            (obj as any).material = new THREE.MeshNormalMaterial();
            (obj as any).material.transparent = true;
            (obj as any).material.opacity = 0;
        }
    }, [gltf]);

    const transform = useMemo(() => new THREE.Object3D(), []);

    useFaceLandmarks((results) => {
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

        faceDetected.current = true;
    });

    useFrame(() => {
        let resetNShapes = 0;
        if (faceDetected.current) {
            resetNShapes = N_SHAPES;
        }

        for (let i = 0; i < MAX_SHAPES; i++) {
            const rigidBody = rigidBodiesRef.current[i];
            const position = rigidBody.translation();
            if (position.y < -5) {
                if (resetNShapes > 0) {
                    // resset shape
                    rigidBody.setTranslation({ ...position, y: 5 }, true);
                    rigidBody.setAngvel({ x: 0, y: 0, z: 0 });
                    rigidBody.setLinvel({ x: 0, y: 0, z: 0 });
                    resetNShapes--;
                    if (resetNShapes == 0) {
                        break;
                    }
                } else {
                    rigidBody.sleep();
                }
            }
        }
    });

    return (
        <Physics gravity={[0, -1, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            {/*<RigidBody colliders="hull" includeInvisible fixed>
                <primitive object={gltf.scene} scale={2.0} />
            </RigidBody>*/}
            <InstancedRigidBodies
                ref={rigidBodiesRef}
                instances={initialShapes}
            >
                <instancedMesh
                    ref={instancedMeshRef}
                    args={[null as any, null as any, MAX_SHAPES]}
                    count={MAX_SHAPES}
                >
                    <boxGeometry />
                    <meshPhongMaterial />
                </instancedMesh>
            </InstancedRigidBodies>
        </Physics>
    );
}
