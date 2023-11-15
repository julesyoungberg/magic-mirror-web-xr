// @todo falling shapes with physics
import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@/hooks/useGLTF";
import { useThree } from "@react-three/fiber";
import { blendshapesMap, useFaceLandmarks } from "@/hooks/useFaceLandmarks";
import { useWebcam } from "@/hooks/useWebcam";
import niceColors from "nice-color-palettes";
import { Background } from "../../Background";

// number of shapes to create each frame
const N_SHAPES = 1;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();
const colorArray = niceColors[17].map((c) => tempColor.set(c).toArray());
