/**
 * Optical flow effect where cubes are generated with colors from the source image.
 */
import { useWebcam } from "@/hooks/useWebcam";
import { useFrame } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";

import { Background } from "../../Background";
import { useOpticalFlow } from "@/hooks/useOpticalFlow";

export function OpticalFlow() {
    const webcam = useWebcam();
    const opticalFlow = useOpticalFlow({});

    useFrame(() => {}, 10);

    return (
        <Physics gravity={[0, -9.8, 0]} interpolate={false} colliders={false}>
            {webcam && <Background texture={webcam.texture} />}
            <pointLight position={[0, 10, 0]} castShadow />
        </Physics>
    );
}
