// based on: https://github.com/hugozanini/realtime-semantic-segmentation/blob/master/src/index.js
import { Background } from "../Background";
import { useWebcamSegmentation } from "@/hooks/useWebcamSegmentation";

const pascalvoc: [number, number, number][] = [
    [0, 0, 0],
    [128, 0, 0],
    [0, 128, 0],
    [128, 128, 0],
    [0, 0, 128],
    [128, 0, 128],
    [0, 128, 128],
    [128, 128, 128],
    [64, 0, 0],
    [192, 0, 0],
    [64, 128, 0],
    [192, 128, 0],
    [64, 0, 128],
    [192, 0, 128],
    [64, 128, 128],
    [192, 128, 128],
    [0, 64, 0],
    [128, 64, 0],
    [0, 192, 0],
    [128, 192, 0],
    [0, 64, 128],
    [128, 64, 128],
    [0, 192, 128],
    [128, 192, 128],
    [64, 64, 0],
    [192, 64, 0],
    [64, 192, 0],
    [192, 192, 0],
    [64, 64, 128],
    [192, 64, 128],
    [64, 192, 128],
    [192, 192, 128],
    [0, 0, 64],
    [128, 0, 64],
    [0, 128, 64],
    [128, 128, 64],
    [0, 0, 192],
    [128, 0, 192],
    [0, 128, 192],
    [128, 128, 192],
    [64, 0, 64],
];

export function SegmentationDemo() {
    const webcamSegmentation = useWebcamSegmentation(
        (index: number) => pascalvoc[index]
    );

    if (!webcamSegmentation) {
        return null;
    }

    return (
        <>
            <Background texture={webcamSegmentation.texture} />
        </>
    );
}
