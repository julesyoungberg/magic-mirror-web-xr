// based on https://github.com/keeffEoghan/glsl-optical-flow/blob/master/index.frag.glsl
import { useOpticalFlow } from "@/hooks/useOpticalFlowGPU";

import { Background } from "../../Background";

export function OpticalFlowGPUDemo() {
    const opticalFlow = useOpticalFlow({});

    return (
        <>
            {opticalFlow.texture && (
                <Background texture={opticalFlow.texture} />
            )}
            <pointLight position={[0, 10, 0]} castShadow />
        </>
    );
}
