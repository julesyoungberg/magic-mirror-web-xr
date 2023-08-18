declare module "@ar-js-org/ar.js/three.js/build/ar-threex" {
    import * as THREE from "three";

    type ArToolkitContextProps = {
        cameraParametersUrl: string;
        detectionMode: string;
        patternRatio: number;
        matrixCodeType: string;
    };

    export class ArToolkitContext {
        _arMarkersControls: ArMarkerControls[];
        arController: any;
        arToolkitContext?: any;
        arToolkitSource?: any;

        constructor(props: ArToolkitContextProps);

        getProjectionMatrix(): THREE.Matrix4;
        update(domElement?: HTMLElement);
        init(callback: () => void);
    }

    export class ArToolkitSource {
        ready?: boolean;
        domElement?: HTMLElement;

        constructor(props: { sourceType: string });

        onResizeElement();
        copyElementSizeTo(domElement: HTMLElement);
        init(callback: () => void);
    }

    type ArMarkerControlsProps = {
        type: string;
        barcodeValue: string | null;
        patternUrl: string | null;
    };

    export class ArMarkerControls {
        constructor(
            ctx: ArToolkitContext,
            root: THREE.Group,
            props: ArMarkerControlsProps
        );
    }
}
