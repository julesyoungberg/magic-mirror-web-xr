import React from "react";
import { Canvas as FiberCanvas } from "@react-three/fiber";

import { ARCanvas } from "./ar/ARCanvas";
import { Scene } from "./scenes";

type Props = React.PropsWithChildren<{
    scene: Scene;
}>;

export function Canvas({ children, scene }: Props) {
    if (scene.startsWith("ar_")) {
        return (
            <ARCanvas
                gl={{ physicallyCorrectLights: true }}
                camera={{ position: [0, 0, 0] }}
                onCreated={({ gl }) => {
                    gl.setSize(window.innerWidth, window.innerHeight);
                }}
            >
                {children}
            </ARCanvas>
        );
    }

    return <FiberCanvas>{children}</FiberCanvas>;
}
