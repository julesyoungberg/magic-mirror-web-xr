// based on https://www.shadertoy.com/view/llGXzR
float radial(vec2 pos, float radius) {
    float result = length(pos)-radius;
    result = fract(result*1.0);
    float result2 = 1.0 - result;
    float fresult = result * result2;
    fresult = pow((fresult*3.),7.);
    return fresult;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 c_uv = uv * 2.0 - 1.0;
    vec2 o_uv = uv * 0.8;
    float gradient = radial(c_uv, time*0.8);
    vec2 fUv = mix(uv, o_uv, gradient);
    outputColor = texture(inputBuffer, fUv);
}
