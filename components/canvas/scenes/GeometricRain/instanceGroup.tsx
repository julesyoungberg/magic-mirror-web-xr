import * as THREE from "three";
import React, { ReactNode, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { InstancedRigidBodies, RapierRigidBody } from "@react-three/rapier";

// number of shapes to create each frame
function newPosition() {
    return [
        Math.random() * 10 - 5,
        5 + Math.random() * 2.0,
        Math.random() * 6 - 3,
    ];
}

type Props = {
    children: ReactNode;
    faceDetected: boolean;
    maxShapes: number;
    newShapesRate: number;
};

// currently works on hot reload but not on initial load of the page
export function InstanceGroup({
    children,
    faceDetected,
    maxShapes,
    newShapesRate,
}: Props) {
    const { camera } = useThree();
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null);

    const initialShapes = useMemo(
        () =>
            new Array(maxShapes).fill(0).map((_, i) => ({
                key: `shape_${i}`,
                live: false,
                position: [Math.random() * 10 - 5, -5, Math.random() * 6 - 3],
                scale: [0.5, 0.5, 0.5],
                rotation: [1, 0, 0], // Math.random(), Math.random(), Math.random()],
            })),
        []
    );

    console.log("InstanceGroup");

    useFrame(() => {
        console.log({ faceDetected });
        let resetNShapes = 0;
        if (faceDetected) {
            resetNShapes = newShapesRate;
        }

        for (let i = 0; i < maxShapes; i++) {
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
                ) &&
                position.y < 0.0
            ) {
                if (resetNShapes > 0) {
                    // resset shape
                    const [x, y, z] = newPosition();
                    rigidBody.setTranslation({ x, y, z }, true);
                    rigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
                    rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true);
                    resetNShapes--;
                    if (resetNShapes == 0) {
                        break;
                    }
                } else if (position.y < -10) {
                    rigidBody.sleep();
                }
            }
        }
    });

    return (
        <InstancedRigidBodies
            ref={rigidBodiesRef}
            instances={initialShapes}
            restitution={0.5}
        >
            <instancedMesh
                ref={instancedMeshRef}
                args={[null as any, null as any, maxShapes]}
                count={maxShapes}
            >
                {children}
            </instancedMesh>
        </InstancedRigidBodies>
    );
}
