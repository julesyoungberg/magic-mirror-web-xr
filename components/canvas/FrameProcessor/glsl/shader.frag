precision highp float;

out highp vec4 pc_fragColor;
uniform sampler2D frame;
uniform sampler2D webcam;
uniform float time;
in vec2 vUv;

// based on https://www.shadertoy.com/view/llGXzR
float radial(vec2 pos, float radius) {
    float result = length(pos)-radius;
    result = fract(result*1.0);
    float result2 = 1.0 - result;
    float fresult = result * result2;
    fresult = pow((fresult*3.),7.);
    return fresult;
}

vec4 getWebcamPixel(vec2 uv) {
    return texture(webcam, vec2(1.0 - uv.x, uv.y));
}

void main() {
    vec2 c_uv = vUv * 2.0 - 1.0;
    vec2 o_uv = vUv * 0.8;
    float gradient = radial(c_uv, time*0.8);
    vec2 fuv = mix(vUv,o_uv,gradient);
    pc_fragColor = getWebcamPixel(fuv); // texture(frame, fuv);
}
