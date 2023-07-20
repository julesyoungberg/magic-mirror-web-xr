import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { forwardRef, useImperativeHandle, useRef } from "react";

import vertex from "./glsl/shader.vert";
import fragment from "./glsl/shader.frag";

const ShaderImpl = shaderMaterial(
    {
        time: 0,
        color: new THREE.Color(0.05, 0.0, 0.025),
    },
    vertex,
    fragment
);

extend({ ShaderImpl });

type Props = React.PropsWithChildren<{}>;

// eslint-disable-next-line react/display-name
const Shader = forwardRef(({ children, ...props }: Props, ref) => {
    const localRef = useRef<{ time: number }>({ time: 0 });

    useImperativeHandle(ref, () => localRef.current);

    useFrame((_, delta) => (localRef.current.time += delta));

    return (
        <shaderImpl
            ref={localRef}
            glsl={THREE.GLSL3}
            {...props}
            attach="material"
        />
    );
});

export default Shader;
