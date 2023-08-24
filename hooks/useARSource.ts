import { ARSourceContext } from "@/components/canvas/ar/ARSourceProvider";
import React from "react";

export function useARSource() {
    return React.useContext(ARSourceContext);
}
