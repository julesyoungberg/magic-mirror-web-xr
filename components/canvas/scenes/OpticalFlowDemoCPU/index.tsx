import { useOpticalFlow } from "@/hooks/useOpticalFlowCPU";

import { Background } from "../../Background";

export function OpticalFlowCPUDemo() {
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
