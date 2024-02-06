import { VIDEO_SIZE } from "@/components/canvas/WebcamProvider";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

import { useCanvasTexture } from "../useCanvasTexture";
import { useWebcam } from "../useWebcam";
import { useOffscreenShaderScene } from "../useOffscreenShaderScene";
import vertexShader from "../../glsl/uv-texture.vert.glsl";
import flowFrag from "./flow.frag.glsl";
import spreadFrag from "./spread.frag.glsl";

const NUM_SPREAD_FRAMES = 2;
const NUM_FLOW_FRAMES = 2;
const NUM_BLEND_FRAMES = 2;
const IN_RANGE = [-1, -1, 1, 1];
const TO_RANGE = [0, 0, 1, 1];

const SPREAD_VIDEO_FRAG = "#define opticalFlowSpreadBlur\n" + spreadFrag;

const SPREAD_VIDEO_PASSES: Record<string, any>[] = [
    { axis: 1.4, pass: 0 },
    { axis: 0, pass: 1.4 },
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

const clearView = { color: [0, 0, 0, 1], depth: 1, stencil: 0 };

function getMap() {
    return new THREE.Texture();
}

function getFrame(width: number, height: number) {
    return new THREE.FramebufferTexture(width, height);
}

const SPREAD_MAPS = new Array(NUM_SPREAD_FRAMES).fill(0).map(() => getMap());

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
    const textureWidth = webcam.canvas.width * window.devicePixelRatio;
    const textureHeight = webcam.canvas.height * window.devicePixelRatio;
    const spreadFrames = useMemo(() => {
        return new Array(NUM_SPREAD_FRAMES)
            .fill(0)
            .map(() => getFrame(textureWidth, textureHeight));
    }, [textureWidth, textureHeight]);
    const flowFrames = useMemo(() => {
        return new Array(NUM_FLOW_FRAMES)
            .fill(0)
            .map(() => getFrame(textureWidth, textureHeight));
    }, [textureWidth, textureHeight]);
    const flowTo = useMemo(
        () => getFrame(textureWidth, textureHeight),
        [textureWidth, textureHeight]
    );
    const blendFrames = useMemo(() => {
        return new Array(NUM_BLEND_FRAMES)
            .fill(0)
            .map(() => getFrame(textureWidth, textureHeight));
    }, [textureWidth, textureHeight]);

    const resizers = [...spreadFrames, ...flowFrames, flowTo, ...blendFrames];
    const clearFlow = { ...clearView, framebuffer: flowTo };

    const clearFlows = flowFrames.map((f) => ({
        ...clearView,
        framebuffer: f,
    }));

    const clearSpreads = spreadFrames.map((f) => ({
        ...clearView,
        framebuffer: f,
    }));

    const clearBlends = blendFrames.map((f) => ({
        ...clearView,
        framebuffer: f,
    }));

    const vector = useMemo(() => {
        return new THREE.Vector2(0, 0);
    }, []);

    const flowShaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: flowFrag,
            uniforms: {
                next: new THREE.Uniform(webcam.texture),
                prev: new THREE.Uniform(webcam.prevFrame.texture),
                offset: new THREE.Uniform(offset),
                lambda: new THREE.Uniform(lambda),
                speed: new THREE.Uniform([speed, speed]),
                alpha: new THREE.Uniform(alpha),
            },
        });
    }, []);

    const flowRenderer = useOffscreenShaderScene({
        ...VIDEO_SIZE,
        shaderMaterial: flowShaderMaterial,
        renderPriority,
    });

    const spreadShaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: spreadFrag,
            uniforms: {
                frame: new THREE.Uniform(spreadFrames[1]),
                axis: new THREE.Uniform(0),
                tint: new THREE.Uniform(0),
                speed: new THREE.Uniform(0),
                flow: new THREE.Uniform(0),
                inRange: new THREE.Uniform(0),
                toRange: new THREE.Uniform(0),
                other: new THREE.Uniform(0),
                blend: new THREE.Uniform(0),
                width: new THREE.Uniform(VIDEO_SIZE.width),
                height: new THREE.Uniform(VIDEO_SIZE.height),
            },
        });
    }, [textureWidth, textureHeight]);

    const spreadRenderer = useOffscreenShaderScene({
        ...VIDEO_SIZE,
        shaderMaterial: spreadShaderMaterial,
        renderPriority,
    });

    // Draws the 2 spread blur `passes` across both axes one after the other.
    function drawSpreadProps(
        props: {
            to: THREE.WebGLTextures;
            passes: Record<string, any>[];
        } & Record<string, any>
    ) {
        // Merge any common `props` into each of `props.passes`.
        for (let idx = 0; idx < spreadFrames.length; idx++) {
            const pass = props.passes[idx];
            const frame = spreadFrames[idx];
            spreadShaderMaterial.uniforms = {
                ...spreadShaderMaterial.uniforms,
                ...props,
                ...pass,
            };
            spreadRenderer.renderer.setRenderTarget(frame);
            spreadRenderer.render();
            spreadRenderer.renderer.copyFramebufferToTexture(vector, frame);
        }
    }

    // Blur the input video's current frame, into the next flow input frame.
    function drawSpreadVideoProps(tick: number) {
        const f = tick % flowFrames.length;

        for (const spread of clearSpreads) {
            spreadRenderer.renderer.clear(
                spread.color as any,
                spread.depth as any,
                spread.stencil as any
            );
        }

        // SPREAD_MAPS[1](videoFrame); wtf?

        flowRenderer.renderer.clear(
            clearFlows[f].color as any,
            clearFlows[f].depth as any,
            clearFlows[f].stencil as any
        );

        SPREAD_VIDEO_PASSES[1].to = flowFrames[f];

        // return drawSpreadProps(spreadVideo); wtf?
    }

    function drawFlowProps() {
        flowRenderer.renderer.clear(
            clearFlow.color as any,
            clearFlow.depth as any,
            clearFlow.stencil as any
        );

        flowRenderer.render();
    }

    /**
     * Blur the past flow frames along each `axis`, shift/advect along the
     * `flow` by `speed`, `tint` to weaken the past flow, `blend` in the next
     * optical-flow frame.
     *
     * @see props.spreadFlow
     */
    function drawSpreadFlowProps(tick: number) {
        for (const spread of clearSpreads) {
            spreadRenderer.renderer.clear(
                spread.color as any,
                spread.depth as any,
                spread.stencil as any
            );
        }

        const flow = blendFrames[tick + (1 % blendFrames.length)];
        SPREAD_FLOW_PASSES[0].passes = flow;

        const b = tick % blendFrames.length;

        // regl.clear(clearBlends[b]); wtf?
        SPREAD_FLOW_PASSES[1].to = blendFrames[b];

        // return drawSpreadProps(spreadFlow); wtf?
    }

    // // Draw to the screen.
    // const drawView = regl({
    //     frag: (_, p) => p.frag ?? viewFrag,
    //     uniforms: {
    //         frame: (c) => wrapGet(c.tick, blendFrames),
    //         inRange: regl.prop("inRange"),
    //         toRange: regl.prop("toRange"),
    //     },
    //     framebuffer: (_, p) => p.to,
    // });

    // function drawViewProps() {
    //     regl.clear(clearView);

    //     return drawView(props.view);
    // }

    function draw({ tick: t }) {
        // Blur the input video's current frame.
        drawSpreadVideoProps(t);
        // Get the optical flow from the last 2 `video` frames.
        drawFlowProps();
        // Spread the past flow frame and blend with the next one.
        drawSpreadFlowProps(t);
        // Draw to the screen.
        drawViewProps();
    }
}
