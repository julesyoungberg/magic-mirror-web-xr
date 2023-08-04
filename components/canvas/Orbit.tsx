import { useThree, extend } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

// react, react three fiber, background, load 360 image
const deg2rad = (degrees: number) => degrees * (Math.PI / 180);

export function Orbit() {
    const { camera, gl } = useThree();
    camera.rotation.set(deg2rad(-30), 0, 0);
    camera.position.set(0, 6, 6);
    return <orbitControls args={[camera, gl.domElement]} />;
}
