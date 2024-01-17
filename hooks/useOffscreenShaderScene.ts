import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

export type OffscreenShaderSceneConfig = {
    width: number;
    height: number;
    shaderMaterial: THREE.ShaderMaterial;
};

export function useOffscreenShaderScene({
    width,
    height,
    shaderMaterial,
}: OffscreenShaderSceneConfig) {
    const shaderScene = useMemo(() => {
        //canvas for shader
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctxShader = canvas.getContext("experimental-webgl", {
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

        return {
            canvas,
            renderer,
            scene,
            camera,
        };
    }, [width, height, shaderMaterial]);

    useFrame(() => {
        shaderScene.renderer.render(shaderScene.scene, shaderScene.camera);
    });

    return shaderScene;
}
