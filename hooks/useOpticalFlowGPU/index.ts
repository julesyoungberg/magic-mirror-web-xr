// adapted from https://github.com/keeffEoghan/glsl-optical-flow/blob/master/demo/index.js
import { VIDEO_SIZE } from "@/components/canvas/WebcamProvider";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useWebcam } from "../useWebcam";
import { useOffscreenShaderScene } from "../useOffscreenShaderScene";
import vertexShader from "../../glsl/uv-texture.vert.glsl";
import flowFrag from "./flow.frag.glsl";
import spreadFrag from "./spread.frag.glsl";
import viewFrag from "./view.frag.glsl";
import { getFrame, useFrames } from "../useFrames";

console.log(spreadFrag);

const NUM_BLEND_FRAMES = 2;
const IN_RANGE = [-1, -1, 1, 1];
const TO_RANGE = [0, 0, 1, 1];

const SPREAD_VIDEO_PASSES: Record<string, any>[] = [
    { axis: [1.4, 0], pass: 0 },
    { axis: [0, 1.4], pass: 1 },
];

const SPREAD_FLOW_PASSES: Record<string, any>[] = [
    {
        pass: 0,
        axis: [3, 0],
        tint: [1, 1, 1, 1],
        speed: [0, 0],
    },
    {
        pass: 1,
        axis: [0, 3],
        tint: [0.99, 0.99, 0.99, 0.99],
        speed: [1, 1],
    },
];

type OpticalFlowOptions = {
    alpha: number;
    lambda: number;
    offset: number;
    speed: [number, number];
    renderPriority: number;
};

export function useOpticalFlow({
    alpha = 100,
    lambda = 1e-3,
    offset = 3,
    speed = [1, 2],
    renderPriority = 10,
}: Partial<OpticalFlowOptions>) {
    const webcam = useWebcam();
    const frameCount = useRef(0);
    const initialized = useRef(false);
    const textureWidth = webcam.canvas.width; // * window.devicePixelRatio;
    const textureHeight = webcam.canvas.height; // * window.devicePixelRatio;

    const spreadFrames = useFrames(
        SPREAD_VIDEO_PASSES.length,
        textureWidth,
        textureHeight
    );

    const flowFrames = useFrames(
        SPREAD_FLOW_PASSES.length,
        textureWidth,
        textureHeight
    );

    const flowTo = useMemo(
        () => getFrame(textureWidth, textureHeight),
        [textureWidth, textureHeight]
    );

    const blendFrames = useFrames(
        NUM_BLEND_FRAMES,
        textureWidth,
        textureHeight
    );

    // const resizers = [...spreadFrames, ...flowFrames, flowTo, ...blendFrames];

    const spreadVideoShaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: "#define opticalFlowSpreadBlur\n" + spreadFrag,
            uniforms: {
                frame: new THREE.Uniform(spreadFrames[1].texture),
                axis: new THREE.Uniform([0, 0]),
                width: new THREE.Uniform(VIDEO_SIZE.width),
                height: new THREE.Uniform(VIDEO_SIZE.height),
            },
        });
    }, [spreadFrames]);

    // const flowShaderMaterial = useMemo(() => {
    //     return new THREE.ShaderMaterial({
    //         vertexShader,
    //         fragmentShader: flowFrag,
    //         uniforms: {
    //             next: new THREE.Uniform(webcam.texture),
    //             prev: new THREE.Uniform(webcam.prevFrame.texture),
    //             offset: new THREE.Uniform(offset),
    //             lambda: new THREE.Uniform(lambda),
    //             speed: new THREE.Uniform([speed, speed]),
    //             alpha: new THREE.Uniform(alpha),
    //         },
    //     });
    // }, [webcam]);

    // const spreadFlowShaderMaterial = useMemo(() => {
    //     return new THREE.ShaderMaterial({
    //         vertexShader,
    //         fragmentShader:
    //             "#define opticalFlowSpreadBlur\n" +
    //             "#define opticalFlowSpreadTint\n" +
    //             "#define opticalFlowSpreadShift opticalFlowSpreadShift_flow\n" +
    //             "#define opticalFlowSpreadBlend\n" +
    //             spreadFrag,
    //         uniforms: {
    //             frame: new THREE.Uniform(spreadFrames[1]),
    //             other: new THREE.Uniform(flowTo),
    //             axis: new THREE.Uniform([0, 0]),
    //             tint: new THREE.Uniform([0, 0, 0, 0]),
    //             speed: new THREE.Uniform([0, 0]),
    //             flow: new THREE.Uniform(flowTo),
    //             inRange: new THREE.Uniform(IN_RANGE),
    //             toRange: new THREE.Uniform(TO_RANGE),
    //             blend: new THREE.Uniform(1),
    //             width: new THREE.Uniform(VIDEO_SIZE.width),
    //             height: new THREE.Uniform(VIDEO_SIZE.height),
    //         },
    //     });
    // }, [flowTo]);

    // const viewShaderMaterial = useMemo(() => {
    //     return new THREE.ShaderMaterial({
    //         vertexShader,
    //         fragmentShader: viewFrag,
    //         uniforms: {
    //             frame: new THREE.Uniform(blendFrames[0]),
    //             inRange: new THREE.Uniform(IN_RANGE),
    //             toRange: new THREE.Uniform(TO_RANGE),
    //         },
    //     });
    // }, []);

    const renderer = useOffscreenShaderScene({
        ...VIDEO_SIZE,
        shaderMaterial: spreadVideoShaderMaterial,
        renderPriority,
    });

    // Draws the 2 spread blur `passes` across both axes one after the other.
    function drawSpread({
        frame,
        passes,
        shaderMaterial,
        to,
        uniforms = {},
    }: {
        frame?: THREE.Texture;
        passes: Record<string, any>[];
        shaderMaterial: THREE.ShaderMaterial;
        to?: THREE.WebGLRenderTarget;
        uniforms?: Record<string, any>;
    }) {
        for (let idx = 0; idx < passes.length; idx++) {
            const { to: passTo, frame: passFrame, ...pass } = passes[idx];
            const inFrame =
                passFrame ||
                frame ||
                spreadFrames[(idx + 1) % spreadFrames.length].texture;
            const outFrame =
                passTo || to || spreadFrames[idx % spreadFrames.length];

            renderer.renderTo({
                shaderMaterial,
                to: outFrame,
                uniforms: {
                    ...uniforms,
                    ...pass,
                    frame: inFrame,
                },
            });
        }
    }

    // Blur the input video's current frame, into the next flow input frame.
    function drawSpreadVideo(tick: number) {
        const f = tick % flowFrames.length;

        // set first pass input
        SPREAD_VIDEO_PASSES[0].frame = webcam.texture;

        // set last pass output
        SPREAD_VIDEO_PASSES[1].to = flowFrames[f];

        return drawSpread({
            passes: SPREAD_VIDEO_PASSES,
            shaderMaterial: spreadVideoShaderMaterial,
        });
    }

    // function drawFlow(tick: number) {
    //     renderer.renderTo({
    //         shaderMaterial: flowShaderMaterial,
    //         to: flowTo,
    //         uniforms: {
    //             next: flowFrames[tick % flowFrames.length],
    //             past: flowFrames[(tick + 1) % flowFrames.length],
    //         },
    //     });
    // }

    /**
     * Blur the past flow frames along each `axis`, shift/advect along the
     * `flow` by `speed`, `tint` to weaken the past flow, `blend` in the next
     * optical-flow frame.
     *
     * @see props.spreadFlow
     */
    // function drawSpreadFlow(tick: number) {
    //     // set first pass input
    //     const frame = blendFrames[(tick + 1) % blendFrames.length];
    //     SPREAD_FLOW_PASSES[0].frame = frame;

    //     // set last pass output
    //     SPREAD_FLOW_PASSES[1].to = blendFrames[tick % blendFrames.length];

    //     return drawSpread({
    //         passes: SPREAD_FLOW_PASSES,
    //         shaderMaterial: spreadFlowShaderMaterial,
    //         uniforms: {
    //             flow: frame,
    //         },
    //     });
    // }

    // function drawView(tick: number) {
    //     // draw to renderer default exture
    //     return renderer.renderTo({
    //         shaderMaterial: viewShaderMaterial,
    //         to: renderer.texture as any,
    //         frame: blendFrames[tick % blendFrames.length],
    //     });
    // }

    function draw(tick: number) {
        // Blur the input video's current frame.
        drawSpreadVideo(tick);
        // // Get the optical flow from the last 2 `video` frames.
        // drawFlow(tick);
        // // Spread the past flow frame and blend with the next one.
        // drawSpreadFlow(tick);
        // // Draw to the screen.
        // drawView(tick);
    }

    useEffect(() => {
        const { videoWidth: w, videoHeight: h } = webcam.video;
        // each((r) => r.resize(w, h), resizers);
        // Pixels units; divide `offset` by the video resolution.
        // flowShaderMaterial.uniforms.offset.value /= Math.max(w, h, 1e3);
        // Fill the flow frames with the first frame.
        drawSpreadVideo(0);
        drawSpreadVideo(1);
        initialized.current = true;
    }, [webcam]);

    useFrame(() => {
        if (!initialized.current) {
            return;
        }

        draw(frameCount.current);
        frameCount.current = (frameCount.current + 1) % 10000;
    });

    return {
        texture: spreadFrames[1].texture, // renderer.texture,
    };
}
