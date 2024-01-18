import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export type OffscreenShaderSceneConfig = {
    width: number;
    height: number;
    shaderMaterial: THREE.ShaderMaterial;
    renderPriority?: number;
};

export function useOffscreenShaderScene({
    width,
    height,
    shaderMaterial,
    renderPriority,
}: OffscreenShaderSceneConfig) {
    const shaderScene = useMemo(() => {
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
            context: ctxShader,
            antialias: true,
            preserveDrawingBuffer: true,
        });
        renderer.setSize(width, height);
        renderer.autoClear = false;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.set(0, 0, 70);
        camera.lookAt(0, 0, 0);

        //draw quad
        const planeShader = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            shaderMaterial
        );
        scene.add(planeShader);

        const texture = new THREE.Texture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;

        return {
            canvas,
            renderer,
            scene,
            camera,
            texture,
        };
    }, [width, height, shaderMaterial]);

    useFrame(() => {
        shaderScene.renderer.render(shaderScene.scene, shaderScene.camera);
        shaderScene.texture.needsUpdate = true;
    }, renderPriority);

    return shaderScene;
}
