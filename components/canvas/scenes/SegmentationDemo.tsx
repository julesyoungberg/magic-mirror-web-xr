import { useSegmentation } from "@/hooks/useSegmentation";
import { Background } from "../Background";

export function SegmentationDemo() {
    const webcamSegmentation = useSegmentation();

    if (!webcamSegmentation) {
        return null;
    }

    return (
        <>
            <Background texture={webcamSegmentation.texture} />
        </>
    );
}
