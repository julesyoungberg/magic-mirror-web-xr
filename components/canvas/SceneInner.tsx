import FrameProcessor from "./FrameProcessor";
import { HolisticDebug } from "./filters/HolisticDebug";
import { Demo } from "./filters/Demo";

export function SceneInner() {
    return (
        <>
            {/*<HolisticDebug />*/}
            <Demo />
            <FrameProcessor />
        </>
    );
}
