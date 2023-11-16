// @todo falling shapes with physics
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { blendshapesMap, useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import {
    MeshCollider,
    InstancedRigidBodies,
    Physics,
    RapierRigidBody,
    RigidBody,
} from "@react-three/rapier";
import niceColors from "nice-color-palettes";
import { Background } from "../../Background";
import { HeadModel } from "./HeadModel";

// number of shapes to create each frame
const N_SHAPES = 100;
const MAX_SHAPES = 100;

const tempColor = new THREE.Color();
const data = Array.from({ length: MAX_SHAPES }, () => ({
    color: niceColors[17][Math.floor(Math.random() * 5)],
    scale: 1,
}));

const initialShapes = new Array(MAX_SHAPES).fill(0).map((_, i) => ({
    key: `shape_${i}`,
    live: false,
    position: [Math.random() * 10 - 5, 5, Math.random() * 4 - 2],
    scale: [0.5, 0.5, 0.5],
    rotation: [1, 0, 0], // Math.random(), Math.random(), Math.random()],
}));

// console.log(initialShapes);

export function GeometricRain() {
    const webcam = useWebcam();
    const { camera } = useThree();
    const faceDetected = useRef(false);
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null);
    const colorArray = useMemo(
        () =>
            Float32Array.from(
                new Array(MAX_SHAPES)
                    .fill(0)
                    .flatMap((_, i) => tempColor.set(data[i].color).toArray())
            ),
        []
    );

    const transform = useMemo(() => new THREE.Object3D(), []);
    const headGroupRef = useRef(null);
    const headMeshRef = useRef(null);

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
            if (headMeshRef.current) {
                headMeshRef.current.position.x = transform.position.x;
                headMeshRef.current.position.y = transform.position.z + 40;
                headMeshRef.current.position.z = -transform.position.y;
                headMeshRef.current.rotation.x = transform.rotation.x;
                headMeshRef.current.rotation.y = transform.rotation.z;
                headMeshRef.current.rotation.z = -transform.rotation.y;
            }
        }

        if (results.faceBlendshapes.length > 0) {
            if (headMeshRef.current) {
                const faceBlendshapes = results.faceBlendshapes[0].categories;
                for (const blendshape of faceBlendshapes) {
                    const categoryName = blendshape.categoryName;
                    const score = blendshape.score;
                    const index =
                        headMeshRef.current.morphTargetDictionary[
                            blendshapesMap[categoryName]
                        ];
                    if (index !== undefined) {
                        headMeshRef.current.morphTargetInfluences[index] =
                            score;
                    }
                }
            }
        }

        if (headMeshRef.current) {
            headMeshRef.current.needsUpdate = true;
        }

        faceDetected.current = true;
    });

    useFrame(() => {
        let resetNShapes = 0;
        if (faceDetected.current) {
            resetNShapes = N_SHAPES;
        }

        for (let i = 0; i < MAX_SHAPES; i++) {
            const rigidBody = rigidBodiesRef.current?.[i];
            if (!rigidBody) {
                continue;
            }

            const position = rigidBody.translation();

            const frustum = new THREE.Frustum();
            const matrix = new THREE.Matrix4().multiplyMatrices(
                camera.projectionMatrix,
                camera.matrixWorldInverse
            );
            frustum.setFromProjectionMatrix(matrix);

            if (
                !frustum.containsPoint(
                    new THREE.Vector3(position.x, position.y, position.z)
                )
            ) {
                if (resetNShapes > 0) {
                    // resset shape
                    rigidBody.setTranslation(
                        {
                            x: Math.random() * 10 - 5,
                            y: 10,
                            z: Math.random() * 4 - 2,
                        },
                        true
                    );
                    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
                    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
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

    console.log({ headGroupRef, headMeshRef });

    return (
        <Physics gravity={[0, -1, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            {/*<RigidBody position={[0, 10, 0]} colliders="ball">
                <MeshCollider type="hull">
                    <HeadModel groupRef={headGroupRef} meshRef={headMeshRef} />
                </MeshCollider>
            </RigidBody>*/}
            <HeadModel groupRef={headGroupRef} meshRef={headMeshRef} />
            <InstancedRigidBodies
                ref={rigidBodiesRef}
                instances={initialShapes}
            >
                <instancedMesh
                    ref={instancedMeshRef}
                    args={[null as any, null as any, MAX_SHAPES]}
                    count={MAX_SHAPES}
                >
                    <boxGeometry>
                        <instancedBufferAttribute
                            attach="attributes-color"
                            args={[colorArray, 3]}
                        />
                    </boxGeometry>
                    <meshBasicMaterial toneMapped={false} vertexColors />
                </instancedMesh>
            </InstancedRigidBodies>
            <pointLight castShadow />
        </Physics>
    );
}
