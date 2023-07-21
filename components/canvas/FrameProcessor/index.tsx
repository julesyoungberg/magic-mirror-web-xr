import { useFrame } from "@react-three/fiber";
import {
    Bloom,
    DepthOfField,
    EffectComposer,
    Noise,
    Vignette,
} from "@react-three/postprocessing";
import { useMemo } from "react";
import * as THREE from "three";

import { Pixelation } from "../effects/Pixelation";
import { NoiseDisplace } from "../effects/NoiseDisplace";
import { TextureBlend } from "../effects/TextureBlend";

function initWebcam() {
    const video = document.createElement("video");
    const constraints = { video: { width: 1280, height: 720 } };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            video.srcObject = mediaStream;
            video.onloadedmetadata = (e) => {
                video.setAttribute("autoplay", "true");
                video.setAttribute("playsinline", "true");
                video.play();
            };
        })
        .catch((err) => {
            alert(err.name + ": " + err.message);
        });
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        throw new Error("failed to get 2d canvas context");
    }
    canvasCtx.fillStyle = "#000000";
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.Texture(canvas);
    return {
        canvas,
        canvasCtx,
        texture,
        video,
    };
}

export default function FrameProcessor() {
    const webcam = useMemo(() => {
        return initWebcam();
    }, []);

    useFrame(() => {
        if (webcam.video.readyState === webcam.video.HAVE_ENOUGH_DATA) {
            webcam.canvasCtx.drawImage(
                webcam.video,
                0,
                0,
                webcam.canvas.width,
                webcam.canvas.height
            );
            webcam.texture.needsUpdate = true;
        }
    }, 1);

    return (
        <EffectComposer>
            <TextureBlend texture={webcam.texture} mix={1.0} flipX />
            <DepthOfField
                focusDistance={0}
                focalLength={0.02}
                bokehScale={2}
                height={480}
            />
            <Bloom
                luminanceThreshold={0}
                luminanceSmoothing={0.9}
                height={300}
            />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
            {/* <Pixelation granularity={0.5} /> */}
            <NoiseDisplace />
        </EffectComposer>
    );
}
