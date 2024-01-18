// varying vec2 v_uv;

// void main() {
//     v_uv = position.xy;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
varying vec2 vUv; 

void main() {
    vUv = uv.xy;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}
