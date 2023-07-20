import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

import vertex from "./glsl/shader.vert";
import fragment from "./glsl/shader.frag";

console.log({ vertex, fragment });

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

function getFullscreenTriangle() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 2));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));

    return geometry;
}

export default function FrameProcessor() {
    const [{ dpr }, size, gl] = useThree(
        (s) => [s.viewport, s.size, s.gl] as const
    );

    const [webcam, screenCamera, screenScene, screen, renderTarget] =
        useMemo(() => {
            let screenScene = new THREE.Scene();
            const screenCamera = new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0,
                1
            );
            const screen = new THREE.Mesh(getFullscreenTriangle());
            screen.frustumCulled = false;
            screenScene.add(screen);

            const webcam = initWebcam();

            const renderTarget = new THREE.WebGLRenderTarget(1280, 720, {
                samples: 4,
                // encoding: gl.encoding,
            });

            renderTarget.depthTexture = new THREE.DepthTexture(
                renderTarget.width,
                renderTarget.height
            ); // fix depth issues

            // use ShaderMaterial for linearToOutputTexel
            screen.material = new THREE.RawShaderMaterial({
                uniforms: {
                    frame: { value: renderTarget.texture },
                    webcam: { value: webcam.texture },
                    time: { value: 0 },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
                glslVersion: THREE.GLSL3,
            });

            return [webcam, screenCamera, screenScene, screen, renderTarget];
        }, []); // gl.encoding]);

    useEffect(() => {
        const { width, height } = size;
        const { w, h } = {
            w: width * dpr,
            h: height * dpr,
        };
        renderTarget.setSize(w, h);
    }, [dpr, size, renderTarget]);

    useFrame(({ scene, camera, gl }, delta) => {
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

        gl.setRenderTarget(renderTarget);
        gl.render(scene, camera);
        gl.setRenderTarget(null);

        if (screen) {
            (Array.isArray(screen.material)
                ? screen.material
                : [screen.material]
            ).forEach((m) => {
                m.uniforms.time.value += delta;
            });
        }

        gl.render(screenScene, screenCamera);
    }, 1);

    return null;
}
