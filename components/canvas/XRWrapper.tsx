"use client";

import { XR, Controllers, Hands } from "@react-three/xr";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export default function XRWrapper({ children }: Props) {
    return (
        <XR>
            <Controllers />
            <Hands />
            {children}
        </XR>
    );
}
