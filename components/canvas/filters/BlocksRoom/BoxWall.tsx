import { useWebcam } from "@/hooks/useWebcam";
import { useDownsamplingCanvas } from "@/hooks/useDownsamplingCanvas";
import { BoxWallBox } from "./BoxWallBox";

type Props = {
    columns: number;
    rows: number;
    roomHeight: number;
    roomWidth: number;
    position: [number, number, number];
    materialNode?: JSX.Element;
};

export function BoxWall({
    columns,
    rows,
    roomHeight,
    roomWidth,
    position,
    materialNode,
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

    // @todo fix start position so that boxes are flush with walls
    const startPosition = [
        -roomWidth * 0.5 + boxWidth * 0.5,
        -roomHeight * 0.9 + boxHeight * 0.5,
    ];

    return (
        <group position={position}>
            {new Array(columns).fill(0).flatMap((_, colIdx) =>
                new Array(rows).fill(0).map((_, rowIdx) => {
                    return (
                        <BoxWallBox
                            key={`${colIdx}_${rowIdx}`}
                            colIdx={colIdx}
                            rowIdx={rows - rowIdx - 1}
                            depthMap={downsampledWebcam}
                            position={[
                                startPosition[0] + colIdx * boxWidth,
                                startPosition[1] + rowIdx * boxHeight,
                                0,
                            ]}
                            scale={[1, 1, Math.random() * 2]}
                            size={[boxWidth, boxHeight, boxDepth]}
                            materialNode={materialNode}
                        />
                    );
                })
            )}
        </group>
    );
}
