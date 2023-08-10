import { HolisticDebug } from "./scenes/HolisticDebug";
import { FaceMeshDemo } from "./scenes/FaceMeshDemo";
import { BlocksRoom } from "./scenes/BlocksRoom";
import { TextureDemo } from "./scenes/TextureDemo";

const DEFAULT_SCENE = "blocks";

const SCENES = {
    texture_demo: TextureDemo,
    holistic_debug: HolisticDebug,
    face_mesh_demo: FaceMeshDemo,
    blocks: BlocksRoom,
};

type Scene = keyof typeof SCENES;

type Props = {
    scene?: keyof typeof SCENES;
};

export function SceneInner({ scene = DEFAULT_SCENE }: Props) {
    const Scene = SCENES[scene];
    return <Scene />;
}
