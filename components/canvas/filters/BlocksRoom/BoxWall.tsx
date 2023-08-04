import { useWebcam } from "@/hooks/useWebcam";
import { useDownsamplingCanvas } from "@/hooks/useDownsamplingCanvas";
import { Box } from "../../primitives/Box";

type Props = {
    columns: number;
    rows: number;
    roomHeight: number;
    roomWidth: number;
    position: [number, number, number];
};

export function BoxWall({
    columns,
    rows,
    roomHeight,
    roomWidth,
    position,
}: Props) {
    const webcam = useWebcam();
    const downsampledWebcam = useDownsamplingCanvas(
        webcam?.canvas,
        columns,
        rows
    );

    const boxWidth = roomWidth / columns;
    const boxHeight = roomHeight / rows;
    const boxDepth = (boxWidth + boxHeight) * 0.5;

    const startPosition = [
        -roomWidth * 0.5 + boxWidth * 0.5,
        -roomHeight * 0.5 + boxWidth * 0.5,
    ];

    return (
        <group position={position}>
            {new Array(columns).fill(0).flatMap((_, colIdx) =>
                new Array(rows).fill(0).map((_, rowIdx) => {
                    const pixel = downsampledWebcam.canvasCtx.getImageData(
                        colIdx,
                        rowIdx,
                        1,
                        1
                    );

                    const brightness =
                        (pixel.data[0] + pixel.data[1] + pixel.data[2]) / 3;

                    return (
                        <Box
                            key={`${colIdx}_${rowIdx}`}
                            position={[
                                startPosition[0] + colIdx * boxWidth,
                                startPosition[0] + rowIdx * boxHeight,
                                0,
                            ]}
                            scale={[1, 1, Math.min(brightness, 0.5)]}
                            size={[boxWidth, boxHeight, boxDepth]}
                        />
                    );
                })
            )}
        </group>
    );
}
