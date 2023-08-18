import { ARContext } from "@/components/canvas/ar/ARProvider";
import React from "react";

export function useAR() {
    const arValue = React.useContext(ARContext);
    return React.useMemo(() => ({ ...arValue }), [arValue]);
}
