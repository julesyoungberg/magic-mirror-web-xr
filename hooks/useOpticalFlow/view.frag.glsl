// https://github.com/keeffEoghan/glsl-optical-flow/blob/master/demo/view.frag.glsl
// Map any flow values.
// #define opticalFlowViewMap

precision highp float;

uniform sampler2D frame;

// Map any flow values.
#ifdef opticalFlowViewMap
  uniform vec4 inRange;
  uniform vec4 toRange;

  #pragma glslify: map = require(glsl-map)
#endif

varying vec2 vUv;

#define tau 6.283185307179586

#pragma glslify: hslToRGB = require(glsl-hsl2rgb)

void main() {
  vec4 data = texture2D(frame, vUv);
  float a = clamp(data.a, 0.0, 1.0);
  vec2 flow = data.xy;

  // Map any flow values.
  #ifdef opticalFlowViewMap
    flow = map(flow, toRange.xy, toRange.zw, inRange.xy, inRange.zw);
  #endif

  // Angle to hue - red right, green up, cyan left, magenta down.
  vec3 color = hslToRGB(atan(flow.y, flow.x)/tau, 0.9*a, 0.6*a);

  gl_FragColor = vec4(color, a);
}