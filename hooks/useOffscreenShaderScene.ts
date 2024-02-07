import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export type OffscreenShaderSceneConfig = {
    width: number;
    height: number;
    shaderMaterial: THREE.ShaderMaterial;
    renderPriority?: number;
    onRender?: (renderer: THREE.WebGLRenderer) => void;
    renderAutomatically?: boolean;
    disabled?: boolean;
};

export function useOffscreenShaderScene({
    width,
    height,
    shaderMaterial,
    renderPriority,
    onRender,
    renderAutomatically,
    disabled,
}: OffscreenShaderSceneConfig) {
    const shaderScene = useMemo(() => {
        if (disabled) {
            return {
                clear() {},
                render() {},
                renderTo() {},
            };
        }

        //canvas for shader
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctxShader = canvas.getContext("webgl2", {
            preserveDrawingBuffer: true,
        });

        //renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            context: ctxShader as any,
            antialias: true,
            preserveDrawingBuffer: true,
        });
        renderer.setSize(width, height);
        renderer.autoClear = false;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.set(0, 0, 1);
        camera.lookAt(0, 0, 0);

        //draw quad
        const planeShader = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            shaderMaterial
        );
        scene.add(planeShader);

        const texture = new THREE.Texture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        function clear() {
            renderer.clear(true, true, true);
            // (renderer.clear as any)([0, 0, 0, 1], 1, 0);
        }

        function render() {
            renderer.render(scene, camera);
            texture.needsUpdate = true;
            onRender?.(renderer);
        }

        function renderTo({
            shaderMaterial,
            to,
            uniforms = {},
        }: {
            shaderMaterial: THREE.ShaderMaterial;
            to: THREE.WebGLRenderTarget;
            uniforms?: Record<string, any>;
        }) {
            shaderMaterial.uniforms = {
                ...shaderMaterial.uniforms,
                ...Object.fromEntries(
                    Object.entries(uniforms).map(([key, value]) => [
                        key,
                        { value },
                    ])
                ),
            };

            planeShader.material = shaderMaterial;

            renderer.setRenderTarget(to);

            clear();

            render();

            to.texture.needsUpdate = true;
        }

        return {
            canvas,
            renderer,
            scene,
            camera,
            texture,
            planeShader,
            clear,
            render,
            renderTo,
        };
    }, [disabled, width, height, shaderMaterial]);

    useFrame(() => {
        if (!renderAutomatically) {
            return;
        }

        shaderScene?.render();
    }, renderPriority);

    return shaderScene;
}
