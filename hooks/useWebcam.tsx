import { WebcamContext } from "@/components/canvas/WebcamProvider";
import { useContext } from "react";

export function useWebcam() {
    return useContext(WebcamContext);
}
