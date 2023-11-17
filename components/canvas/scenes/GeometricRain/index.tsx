// @todo falling shapes with physics
import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { blendshapesMap, useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import { Physics } from "@react-three/rapier";
import niceColors from "nice-color-palettes";
import { Background } from "../../Background";
import { HeadModel } from "./HeadModel";
import { InstanceGroup } from "./InstanceGroup";

// number of shapes to create each frame
const N_SHAPES = 100;
const MAX_SHAPES = 200;

const tempColor = new THREE.Color();
const data = Array.from({ length: MAX_SHAPES }, () => ({
    color: niceColors[17][Math.floor(Math.random() * 5)],
    scale: 1,
}));

export function GeometricRain() {
    const webcam = useWebcam();
    const [faceDetected, setFaceDetected] = useState(false);
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

            setFaceDetected(true);
        } else {
            setFaceDetected(false);
        }

        if (headMeshRef.current) {
            headMeshRef.current.needsUpdate = true;
        }
    });

    console.log({ headGroupRef, headMeshRef, faceDetected });

    return (
        <Physics gravity={[0, -9.8, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            <HeadModel groupRef={headGroupRef} meshRef={headMeshRef} />
            {faceDetected.current && (
                <InstanceGroup
                    faceDetected={faceDetected.current}
                    maxShapes={MAX_SHAPES}
                    newShapesRate={N_SHAPES}
                >
                    <boxGeometry>
                        <instancedBufferAttribute
                            attach="attributes-color"
                            args={[colorArray, 3]}
                        />
                    </boxGeometry>
                    <meshBasicMaterial toneMapped={false} vertexColors />
                </InstanceGroup>
            )}
            <pointLight castShadow />
        </Physics>
    );
}
