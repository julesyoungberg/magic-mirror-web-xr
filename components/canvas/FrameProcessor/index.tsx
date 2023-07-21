import {
    Bloom,
    DepthOfField,
    EffectComposer,
    Noise,
    Vignette,
} from "@react-three/postprocessing";

import { Pixelation } from "../effects/Pixelation";
import { NoiseDisplace } from "../effects/NoiseDisplace";
import { TextureBlend } from "../effects/TextureBlend";
import { useWebcam } from "@/hooks/useWebcam";

export default function FrameProcessor() {
    const webcam = useWebcam();

    return (
        <EffectComposer>
            <TextureBlend texture={webcam?.texture} mix={1.0} flipX />
            <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
            />
            <Bloom
                luminanceThreshold={0}
                luminanceSmoothing={0.9}
                height={300}
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            <Pixelation granularity={10.0} />
            <NoiseDisplace />
        </EffectComposer>
    );
}
