import { ARDemo } from "./ARDemo";
import { HolisticDebug } from "./HolisticDebug";
import { FaceMeshDemo } from "./FaceMeshDemo";
import { BlocksRoom } from "./BlocksRoom";
import { TextureDemo } from "./TextureDemo";
import { SegmentationDemo } from "./SegmentationDemo";
import { GeometricRain } from "./GeometricRain";

export const SCENES = {
    ar_demo: ARDemo,
    texture_demo: TextureDemo,
    holistic_debug: HolisticDebug,
    face_mesh_demo: FaceMeshDemo,
    geometric_rain: GeometricRain,
    segmentation_demo: SegmentationDemo,
    blocks: BlocksRoom,
};

export type Scene = keyof typeof SCENES;

export const DEFAULT_SCENE: Scene = "geometric_rain";
