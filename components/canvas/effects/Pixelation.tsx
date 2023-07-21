import { PixelationEffect } from "postprocessing";
import React, { forwardRef, useMemo } from "react";

type Props = {
    granularity: number;
};

export const Pixelation = forwardRef(({ granularity = 5 }: Props, ref) => {
    const effect = useMemo(
        () => new PixelationEffect(granularity),
        [granularity]
    );
    return <primitive ref={ref} object={effect} dispose={null} />;
});
