// based on https://github.com/keeffEoghan/glsl-optical-flow/blob/master/index.frag.glsl
import { useOpticalFlow } from "@/hooks/useOpticalFlow";

import { Background } from "../../Background";

export function OpticalFlowDemo() {
    const opticalFlow = useOpticalFlow({});

    return (
        <>
            <Background texture={opticalFlow.texture} />
            <pointLight position={[0, 10, 0]} castShadow />
        </>
    );
}
