/**
 * Optical flow fragment shader, for convenience.
 *
 * @see ./index.frag
 */

#define opticalFlowMap

precision highp float;

uniform sampler2D next;
uniform sampler2D past;
uniform float offset;
uniform float lambda;
uniform float alpha;
uniform vec2 speed;

// Optionally map the flow ([-1, 1]) to a different range (e.g: [0, 1]).
#ifdef opticalFlowMap
  uniform vec4 inRange;
  uniform vec4 outRange;

  #pragma glslify: map = require(glsl-map)
#endif

varying vec2 vUv;

// #pragma glslify: opticalFlow = require(@epok.tech/glsl-optical-flow)
#pragma glslify: opticalFlow = require(./optical-flow)

void main() {
  vec2 flow = opticalFlow(vUv, next, past, offset, lambda);
  float power = dot(flow, flow);

  flow *= speed;

  // Optionally map the flow ([-1, 1]) to a different range (e.g: [0, 1]).
  #ifdef opticalFlowMap
    flow = map(flow, inRange.xy, inRange.zw, outRange.xy, outRange.zw);
  #endif

  gl_FragColor = vec4(flow, power, clamp(power*alpha, 0.0, 1.0));
//   gl_FragColor = vec4(vUv.xy, 0.9, 1.0);
}
