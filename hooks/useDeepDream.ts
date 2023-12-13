/**
 * Deap dream in the browser
 * https://www.tensorflow.org/tutorials/generative/deepdream
 * https://www.tensorflow.org/js/guide/conversion
 * 
 */
import * as tf from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

export function useDeepDream() {
    const [model, setModel] = useState<any>(undefined);

    useEffect(() => {
        async function load() {
            const baseModel = await tf.loadLayersModel(
                "/deep_dream/inception_v3_weights_tfjs/model.json"
            );

            console.log(baseModel);
        }

        load();
    }, []);
}
