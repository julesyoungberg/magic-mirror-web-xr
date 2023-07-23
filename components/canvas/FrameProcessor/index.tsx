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
import { useBodyPix } from "@/hooks/useBodyPix";
import { useBodyPixMask } from "@/hooks/useBodyPixMask";
import { useHolisticDebug } from "@/hooks/useHolisticDebug";
import { useHolisticDetector } from "@/hooks/useHolisticDetector";

export default function FrameProcessor() {
    // const { canvasTexture, drawMask } = useBodyPixMask();
    // useBodyPix(drawMask);
    const { canvasTexture, drawFeatures } = useHolisticDebug();
    useHolisticDetector(drawFeatures);

    return (
        <EffectComposer>
            <TextureBlend texture={canvasTexture.texture} mix={1.0} flipX />
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
            {/* <Noise opacity={0.02} /> */}
            {/*<Vignette eskil={false} offset={0.1} darkness={1.1} />*/}
            {/*<Pixelation granularity={10.0} />*/}
            <NoiseDisplace />
        </EffectComposer>
    );
}
