import { VIDEO_SIZE } from "@/components/canvas/WebcamProvider";
import flowFrag from "@epok.tech/glsl-optical-flow/index.frag.glsl";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { useCanvasTexture } from "../useCanvasTexture";
import { useWebcam } from "../useWebcam";
import { useOffscreenShaderScene } from "../useOffscreenShaderScene";

export function useOpticalFlow() {
    const webcam = useWebcam();
    const prevFrame = useCanvasTexture(VIDEO_SIZE);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            fragmentShader: flowFrag,
            uniforms: {
                next: new THREE.Uniform(webcam?.canvas),
                prev: new THREE.Uniform(prevFrame.canvas),
                offset: new THREE.Uniform(3),
                lambda: new THREE.Uniform(1e-3),
                speed: new THREE.Uniform(1),
                alpha: new THREE.Uniform(100),
            },
        });
    }, []);

    const offscreenShaderScene = useOffscreenShaderScene({
        ...VIDEO_SIZE,
        shaderMaterial: shaderMaterial,
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
