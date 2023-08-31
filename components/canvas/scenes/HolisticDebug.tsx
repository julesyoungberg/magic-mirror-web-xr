import { useHolisticDebug } from "@/hooks/useHolisticDebug";
import { useHolisticDetector } from "@/hooks/useHolisticDetector";
import { Background } from "../Background";
import { Box } from "../primitives/Box";

export function HolisticDebug() {
    const { canvasTexture, drawFeatures } = useHolisticDebug();
    useHolisticDetector(drawFeatures);

    return (
        <>
            <Background texture={canvasTexture.texture} />
            <Box />
        </>
    );
}
