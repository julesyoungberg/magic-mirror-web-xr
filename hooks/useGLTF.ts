import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

export function withKTX2(loader: GLTFLoader) {
    const ktxLoader = new KTX2Loader();
    ktxLoader.setTranscoderPath("three/examples/js/libs/basis/");
    loader.setKTX2Loader(ktxLoader);
    loader.setMeshoptDecoder(MeshoptDecoder);
}

export function useGLTF(path: string) {
    return useLoader(GLTFLoader, path, withKTX2);
}
