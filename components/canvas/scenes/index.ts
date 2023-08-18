import { ARDemo } from "./ARDemo";
import { HolisticDebug } from "./HolisticDebug";
import { FaceMeshDemo } from "./FaceMeshDemo";
import { BlocksRoom } from "./BlocksRoom";
import { TextureDemo } from "./TextureDemo";

export const SCENES = {
    ar_demo: ARDemo,
    texture_demo: TextureDemo,
    holistic_debug: HolisticDebug,
    face_mesh_demo: FaceMeshDemo,
    blocks: BlocksRoom,
};

export type Scene = keyof typeof SCENES;

export const DEFAULT_SCENE: Scene = "ar_demo";
