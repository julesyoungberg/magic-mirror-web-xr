import { BlendFunction, Effect } from "postprocessing";
import React, { forwardRef, useEffect, useMemo } from "react";
import { Uniform } from "three";

const fragmentShader = `
    uniform sampler2D layer;
    uniform float layerMix;
    uniform bool flipX;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 lUv = vec2(mix(uv.x, 1.0 - uv.x, float(flipX)), uv.y);
        outputColor = mix(inputColor, texture(layer, lUv), layerMix);
    }
`;

// Effect implementation
class TextureBlendImpl extends Effect {
    constructor(texture: WebGLTexture | null, mix: number, flipX: boolean) {
        super("TextureBlend", fragmentShader, {
            blendFunction: BlendFunction.SET,
            uniforms: new Map([
                ["layer", new Uniform(texture)],
                ["layerMix", new Uniform(mix)],
                ["flipX", new Uniform(flipX)],
            ]),
        });
    }
}

type Props = {
    texture?: WebGLTexture;
    mix: number;
    flipX?: boolean;
};

// Effect component
export const TextureBlend = forwardRef(
    ({ texture, mix, flipX = false }: Props, ref) => {
        const effect = useMemo(
            () => new TextureBlendImpl(texture || null, mix, flipX),
            [texture]
        );

        useEffect(() => {
            effect.uniforms.get("layerMix")!.value = mix;
            effect.uniforms.get("flipX")!.value = flipX;
        }, [mix, flipX]);

        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
