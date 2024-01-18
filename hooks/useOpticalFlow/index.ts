import { VIDEO_SIZE } from "@/components/canvas/WebcamProvider";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { useCanvasTexture } from "../useCanvasTexture";
import { useWebcam } from "../useWebcam";
import { useOffscreenShaderScene } from "../useOffscreenShaderScene";
import vertexShader from "../../glsl/uv-texture.vert.glsl";
import flowFrag from "./flow.frag.glsl";

console.log(vertexShader);
console.log(flowFrag);

type OpticalFlowOptions = {
    alpha: number;
    lambda: number;
    offset: number;
    speed: number;
    renderPriority: number;
};

export function useOpticalFlow({
    alpha = 100,
    lambda = 1e-3,
    offset = 3,
    speed = 1,
    renderPriority = 10,
}: Partial<OpticalFlowOptions>) {
    const webcam = useWebcam();
    const prevFrame = useCanvasTexture(VIDEO_SIZE);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: flowFrag,
            uniforms: {
                next: new THREE.Uniform(webcam.texture),
                prev: new THREE.Uniform(prevFrame.texture),
                offset: new THREE.Uniform(offset),
                lambda: new THREE.Uniform(lambda),
                speed: new THREE.Uniform(speed),
                alpha: new THREE.Uniform(alpha),
            },
        });
    }, []);

    const offscreenShaderScene = useOffscreenShaderScene({
        ...VIDEO_SIZE,
        shaderMaterial,
        renderPriority,
    });

    useFrame(() => {
        if (
            !webcam ||
            webcam.video.readyState !== webcam.video.HAVE_ENOUGH_DATA
        ) {
            return;
        }

        prevFrame.canvasCtx.scale(-1, 1);
        prevFrame.canvasCtx.drawImage(
            webcam.canvas,
            0,
            0,
            webcam.canvas.width * -1,
            webcam.canvas.height
        );
        prevFrame.canvasCtx.restore();
        prevFrame.texture.needsUpdate = true;
    }, 1000); // run last

    return offscreenShaderScene;
}
