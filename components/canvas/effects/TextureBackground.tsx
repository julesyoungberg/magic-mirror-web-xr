import { BlendFunction, Effect } from "postprocessing";
import React, { forwardRef, useEffect, useMemo } from "react";
import { Uniform } from "three";

const fragmentShader = `
    uniform sampler2D background;
    uniform bool flipX;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 lUv = vec2(mix(uv.x, 1.0 - uv.x, float(flipX)), uv.y);
        outputColor = mix(inputColor, texture(background, lUv), 1.0 - inputColor.a);
    }
`;

// Effect implementation
class TextureBackgroundImpl extends Effect {
    constructor(texture: WebGLTexture | null, flipX: boolean) {
        super("TextureBackground", fragmentShader, {
            blendFunction: BlendFunction.SET,
            uniforms: new Map([
                ["layer", new Uniform(texture)],
                ["flipX", new Uniform(flipX)],
            ]),
        });
    }
}

type Props = {
    texture?: WebGLTexture;
    flipX?: boolean;
};

// Effect component
export const TextureBackground = forwardRef(
    ({ texture, flipX = false }: Props, ref) => {
        const effect = useMemo(
            () => new TextureBackgroundImpl(texture || null, flipX),
            [texture]
        );

        useEffect(() => {
            effect.uniforms.get("flipX")!.value = flipX;
        }, [flipX]);

        return <primitive ref={ref} object={effect} dispose={null} />;
    }
);
