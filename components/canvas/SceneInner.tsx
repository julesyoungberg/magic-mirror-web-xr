import FrameProcessor from "./FrameProcessor";
import { HolisticDebug } from "./filters/HolisticDebug";
import { Demo } from "./filters/Demo";
import { BlocksRoom } from "./filters/BlocksRoom";

export function SceneInner() {
    return (
        <>
            {/*<HolisticDebug />*/}
            {/*<Demo />*/}
            <BlocksRoom />
            <FrameProcessor />
        </>
    );
}
