import { BlendFunction, Effect } from "postprocessing";
import React, { forwardRef, useMemo } from "react";

const fragmentShader = `
void mainUv(inout vec2 uv) {
    uv.x = 1.0 - uv.x;
}
`;

// Effect implementation
class MirrorXImpl extends Effect {
    constructor() {
        super("MirrorX", fragmentShader, {
            blendFunction: BlendFunction.SET,
        });
    }
}

// Effect component
export const MirrorX = forwardRef(({}, ref) => {
    const effect = useMemo(() => new MirrorXImpl(), []);
    return <primitive ref={ref} object={effect} dispose={null} />;
});
