import * as THREE from "three";
import { useWebcam } from "@/hooks/useWebcam";
import { useMemo, useState } from "react";
import { useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { Physics } from "@react-three/rapier";
import { Background } from "../../Background";
import niceColors from "nice-color-palettes";
import { InstanceGroup } from "./InstanceGroup";

const N_SHAPES = 3;

const tempColor = new THREE.Color();
const data = Array.from({ length: N_SHAPES }, () => ({
    color: niceColors[17][Math.floor(Math.random() * 5)],
    scale: 1,
}));

export function Gravity() {
    const webcam = useWebcam();
    const [facePosition, setFacePosition] = useState<
        [number, number, number] | undefined
    >(undefined);
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

            setFacePosition(transform.position.toArray());
        } else {
            setFacePosition(undefined);
        }
    });

    return (
        <Physics gravity={[0, 0, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            <InstanceGroup facePosition={facePosition} nShapes={N_SHAPES}>
                <boxGeometry>
                    <instancedBufferAttribute
                        attach="attributes-color"
                        args={[colorArray, 3]}
                    />
                </boxGeometry>
                <meshBasicMaterial toneMapped={false} vertexColors />
            </InstanceGroup>
        </Physics>
    );
}
