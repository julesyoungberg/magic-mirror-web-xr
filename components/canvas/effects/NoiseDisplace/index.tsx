import { BlendFunction, Effect, EffectAttribute } from "postprocessing";
import React, { forwardRef, useMemo } from "react";

import fragmentShader from "./shader.frag";

// Effect implementation
class NoiseDisplaceImpl extends Effect {
    constructor() {
        super("NoiseDisplace", fragmentShader, {
            blendFunction: BlendFunction.SET,
        });
    }
}

// Effect component
export const NoiseDisplace = forwardRef(({}, ref) => {
    const effect = useMemo(() => new NoiseDisplaceImpl(), []);
    return <primitive ref={ref} object={effect} dispose={null} />;
});
