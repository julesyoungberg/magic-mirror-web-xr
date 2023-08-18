declare module "@artcom/react-three-arjs" {
    import React from "raect";
    import { CanvasProps } from "@react-three/fiber";

    export const ARCanvas: React.Component<CanvasProps>;

    export const ARMarker: React.Component<{
        type: string;
        patternUrl: string;
    }>;
}
