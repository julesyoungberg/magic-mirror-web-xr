"use client";

import { Canvas } from "@react-three/fiber";
import { ARButton } from "@react-three/xr";

import ConditionalWrapper from "../helpers/ConditionalWrapper";
import XRWrapper from "./XRWrapper";

export default function Scene() {
  // @todo check for support
  const supportsXR = true;

  return (
    <>
      {supportsXR && <ARButton />}
      <Canvas>
        <ConditionalWrapper
          predicate={supportsXR}
          wrapper={(children) => <XRWrapper>{children}</XRWrapper>}
        >
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </ConditionalWrapper>
      </Canvas>
    </>
  );
}
