import * as THREE from "three";
import React, { ReactNode, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedRigidBodies, RapierRigidBody } from "@react-three/rapier";

const SHAPE_MASS = 0.01;
const HEAD_MASS = 1.0;
const G = 6.673 * Math.pow(10, -11);

type Props = {
    children: ReactNode;
    facePosition?: [number, number, number];
    nShapes: number;
};

export function InstanceGroup({ children, facePosition, nShapes }: Props) {
    const instancedMeshRef = useRef<THREE.InstancedMesh>(null!);
    const rigidBodiesRef = useRef<RapierRigidBody[]>(null);
    const initialShapes = useMemo(
        () =>
            new Array(nShapes).fill(0).map((_, i) => ({
                key: `shape_${i}`,
                live: false,
                position: [Math.random() * 10 - 5, -10, Math.random() * 6 - 3],
                scale: [0.5, 0.5, 0.5],
                rotation: [1, 0, 0], // Math.random(), Math.random(), Math.random()],
            })),
        []
    );

    useFrame(() => {
        if (!facePosition) {
            return;
        }

        for (let i = 0; i < nShapes; i++) {
            const rigidBody = rigidBodiesRef.current?.[i];
            if (!rigidBody) {
                continue;
            }

            const position = rigidBody.translation();

            const diffVector = new THREE.Vector3().subVectors(
                new THREE.Vector3(position.x, position.y, position.z),
                new THREE.Vector3(...facePosition)
            );

            const distance = diffVector.length();

            const forceMag =
                (G * HEAD_MASS * SHAPE_MASS) / Math.pow(distance, 2);

            diffVector.normalize();
            diffVector.multiplyScalar(forceMag);

            rigidBody.applyImpulse(diffVector, true);

            /** @todo maybe? */
            /** apply inverse gravity force */
            /** reset offscreen shapes */
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
                args={[null as any, null as any, nShapes]}
                count={nShapes}
                castShadow
                receiveShadow
            >
                {children}
            </instancedMesh>
        </InstancedRigidBodies>
    );
}
