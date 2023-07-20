import Box from "./Box";
import Shader from "./Shader";
import FrameProcessor from "./FrameProcessor";

export function SceneInner() {
    return (
        <>
            <mesh>
                <boxGeometry />
                <meshBasicMaterial color="blue" />
                <Shader />
            </mesh>
            <FrameProcessor />
        </>
    );
}
