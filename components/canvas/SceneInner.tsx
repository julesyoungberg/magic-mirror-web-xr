import { Scene, SCENES } from "./scenes";

type Props = {
    scene: Scene;
};

export function SceneInner({ scene }: Props) {
    const Scene = SCENES[scene];
    return <Scene />;
}
