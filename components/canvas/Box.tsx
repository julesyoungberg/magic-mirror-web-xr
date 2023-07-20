import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

type Props = {
    position: [x: number, y: number, z: number];
};

export default function Box(props: Props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef<any>();
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((_state, delta) => (meshRef.current.rotation.x += delta));
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
        </mesh>
    );
}
