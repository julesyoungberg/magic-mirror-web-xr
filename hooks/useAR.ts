import { ARContext } from "@/components/canvas/ar/ARProvider";
import React from "react";

export function useAR() {
    return React.useContext(ARContext);
}
