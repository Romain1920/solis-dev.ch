/*
 * Liquid glass shader extraction.
 * Derived from iyinchao/liquid-glass-studio, MIT License.
 * Copyright (c) 2024 Charles Yin.
 */

const sdf = `
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float superellipseCornerSDF(vec2 p, float r, float n) {
  p = abs(p);
  float v = pow(pow(p.x, n) + pow(p.y, n), 1.0 / n);
  return v - r;
}

float roundedRectSDF(vec2 p, vec2 center, float width, float height, float cornerRadius, float n) {
  p -= center;

  float cr = cornerRadius * u_dpr;
  vec2 d = abs(p) - vec2(width * u_dpr, height * u_dpr) * 0.5;
  float dist;

  if (d.x > -cr && d.y > -cr) {
    vec2 cornerCenter = sign(p) * (vec2(width * u_dpr, height * u_dpr) * 0.5 - vec2(cr));
    vec2 cornerP = p - cornerCenter;
    dist = superellipseCornerSDF(cornerP, cr, n);
  } else {
    dist = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
  }

  return dist;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float mainSDF(vec2 p1, vec2 p2, vec2 p) {
  vec2 p1n = p1 + p / u_resolution.y;
  vec2 p2n = p2 + p / u_resolution.y;

  float d1 = u_showShape1 == 1 ? sdCircle(p1n, 100.0 * u_dpr / u_resolution.y) : 1.0;
  float d2 = roundedRectSDF(
    p2n,
    vec2(0.0),
    u_shapeWidth / u_resolution.y,
    u_shapeHeight / u_resolution.y,
    u_shapeRadius / u_resolution.y,
    u_shapeRoundness
  );

  return smin(d1, d2, u_mergeRate);
}
`;

const math = `
float safeAsin(float x) {
  return asin(clamp(x, -1.0, 1.0));
}
`;

const color = `
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const vec3 D65_WHITE = vec3(0.95045592705, 1.0, 1.08905775076);
const vec3 D50_WHITE = vec3(0.96429567643, 1.0, 0.82510460251);
vec3 WHITE = D65_WHITE;
const mat3 RGB_TO_XYZ_M = mat3(
  0.4124, 0.3576, 0.1805,
  0.2126, 0.7152, 0.0722,
  0.0193, 0.1192, 0.9505
);
const mat3 XYZ_TO_XYZ50_M = mat3(
   1.0479298208405488  ,  0.022946793341019088, -0.05019222954313557 ,
   0.029627815688159344,  0.990434484573249   , -0.01707382502938514 ,
  -0.009243058152591178,  0.015055144896577895,  0.7518742899580008
);
const mat3 XYZ_TO_RGB_M = mat3(
   3.2406255, -1.537208 , -0.4986286,
  -0.9689307,  1.8757561,  0.0415175,
   0.0557101, -0.2040211,  1.0569959
);
const mat3 XYZ50_TO_XYZ_M = mat3(
   0.9554734527042182  , -0.023098536874261423,  0.0632593086610217  ,
  -0.028369706963208136,  1.0099954580058226  ,  0.021041398966943008,
   0.012314001688319899, -0.020507696433477912,  1.3303659366080753
);
float UNCOMPAND_SRGB(float a) {
  return a > 0.04045 ? pow((a + 0.055) / 1.055, 2.4) : a / 12.92;
}
float COMPAND_RGB(float a) {
  return a <= 0.0031308 ? 12.92 * a : 1.055 * pow(a, 0.41666666666) - 0.055;
}
vec3 RGB_TO_XYZ(vec3 rgb) {
  return WHITE == D65_WHITE ? rgb * RGB_TO_XYZ_M : rgb * RGB_TO_XYZ_M * XYZ_TO_XYZ50_M;
}
vec3 SRGB_TO_RGB(vec3 srgb) {
  return vec3(UNCOMPAND_SRGB(srgb.x), UNCOMPAND_SRGB(srgb.y), UNCOMPAND_SRGB(srgb.z));
}
vec3 RGB_TO_SRGB(vec3 rgb) {
  return vec3(COMPAND_RGB(rgb.x), COMPAND_RGB(rgb.y), COMPAND_RGB(rgb.z));
}
vec3 SRGB_TO_XYZ(vec3 srgb) {
  return RGB_TO_XYZ(SRGB_TO_RGB(srgb));
}
float XYZ_TO_LAB_F(float x) {
  return x > 0.00885645167 ? pow(x, 0.333333333) : 7.78703703704 * x + 0.13793103448;
}
vec3 XYZ_TO_LAB(vec3 xyz) {
  vec3 xyz_scaled = xyz / WHITE;
  xyz_scaled = vec3(
    XYZ_TO_LAB_F(xyz_scaled.x),
    XYZ_TO_LAB_F(xyz_scaled.y),
    XYZ_TO_LAB_F(xyz_scaled.z)
  );
  return vec3(
    116.0 * xyz_scaled.y - 16.0,
    500.0 * (xyz_scaled.x - xyz_scaled.y),
    200.0 * (xyz_scaled.y - xyz_scaled.z)
  );
}
vec3 SRGB_TO_LAB(vec3 srgb) {
  return XYZ_TO_LAB(SRGB_TO_XYZ(srgb));
}
vec3 LAB_TO_LCH(vec3 Lab) {
  return vec3(Lab.x, sqrt(dot(Lab.yz, Lab.yz)), atan(Lab.z, Lab.y) * 57.2957795131);
}
vec3 SRGB_TO_LCH(vec3 srgb) {
  return LAB_TO_LCH(SRGB_TO_LAB(srgb));
}
vec3 XYZ_TO_RGB(vec3 xyz) {
  return WHITE == D65_WHITE ? xyz * XYZ_TO_RGB_M : xyz * XYZ50_TO_XYZ_M * XYZ_TO_RGB_M;
}
vec3 XYZ_TO_SRGB(vec3 xyz) {
  return RGB_TO_SRGB(XYZ_TO_RGB(xyz));
}
float LAB_TO_XYZ_F(float x) {
  return x > 0.206897 ? x * x * x : 0.12841854934 * (x - 0.137931034);
}
vec3 LAB_TO_XYZ(vec3 Lab) {
  float w = (Lab.x + 16.0) / 116.0;
  return WHITE * vec3(LAB_TO_XYZ_F(w + Lab.y / 500.0), LAB_TO_XYZ_F(w), LAB_TO_XYZ_F(w - Lab.z / 200.0));
}
vec3 LAB_TO_SRGB(vec3 lab) {
  return XYZ_TO_SRGB(LAB_TO_XYZ(lab));
}
vec3 LCH_TO_LAB(vec3 LCh) {
  return vec3(LCh.x, LCh.y * cos(LCh.z * 0.01745329251), LCh.y * sin(LCh.z * 0.01745329251));
}
vec3 LCH_TO_SRGB(vec3 lch) {
  return LAB_TO_SRGB(LCH_TO_LAB(lch));
}
`;

export const vertexShader = `#version 300 es

in vec4 a_position;
out vec2 v_uv;

void main() {
  v_uv = (a_position.xy + 1.0) * 0.5;
  gl_Position = a_position;
}
`;

export const fragmentBgShader = `#version 300 es

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec2 u_mouseSpring;
uniform float u_mergeRate;
uniform float u_shapeWidth;
uniform float u_shapeHeight;
uniform float u_shapeRadius;
uniform float u_shapeRoundness;
uniform float u_shadowExpand;
uniform float u_shadowFactor;
uniform vec2 u_shadowPosition;
uniform int u_showShape1;
uniform vec3 u_baseColor;
uniform vec3 u_accentColor;
uniform vec3 u_warmColor;
uniform vec2 u_pointer;

${sdf}

float wave(vec2 p) {
  return sin(p.x * 8.0 + p.y * 4.0) * 0.5 + sin(p.x * 3.0 - p.y * 9.0) * 0.5;
}

void main() {
  vec2 u_resolution1x = u_resolution.xy / u_dpr;
  vec2 uv = v_uv;
  vec2 centered = uv - 0.5;
  float diagonal = smoothstep(-0.35, 0.85, centered.x - centered.y);
  float coolEdge = smoothstep(0.65, 0.08, distance(uv, vec2(0.2 + u_pointer.x * 0.06, 0.86 + u_pointer.y * 0.03)));
  float warmEdge = smoothstep(0.62, 0.05, distance(uv, vec2(0.92 + u_pointer.x * 0.04, 0.08 + u_pointer.y * 0.04)));
  float surface = wave(uv + u_pointer * 0.02) * 0.018;

  vec3 bgColor = mix(u_baseColor * 0.88, u_baseColor * 1.18, diagonal);
  bgColor = mix(bgColor, u_accentColor, coolEdge * 0.22);
  bgColor = mix(bgColor, u_warmColor, warmEdge * 0.14);
  bgColor += surface;

  vec2 p1 =
    (vec2(0, 0) -
      u_resolution.xy * 0.5 +
      vec2(u_shadowPosition.x * u_dpr, u_shadowPosition.y * u_dpr)) /
    u_resolution.y;
  vec2 p2 =
    (vec2(0, 0) - u_mouseSpring + vec2(u_shadowPosition.x * u_dpr, u_shadowPosition.y * u_dpr)) /
    u_resolution.y;
  float merged = mainSDF(p1, p2, gl_FragCoord.xy);
  float shadow = exp(-1.0 / u_shadowExpand * abs(merged) * u_resolution1x.y) * 0.6 * u_shadowFactor;

  fragColor = vec4(max(bgColor - vec3(shadow), vec3(0.0)), 1.0);
}
`;

export const fragmentBgHBlurShader = `#version 300 es

precision highp float;

#define MAX_BLUR_RADIUS (200)

in vec2 v_uv;

uniform sampler2D u_prevPassTexture;
uniform vec2 u_resolution;
uniform int u_blurRadius;
uniform float u_blurWeights[MAX_BLUR_RADIUS + 1];

out vec4 fragColor;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  vec4 color = texture(u_prevPassTexture, v_uv) * u_blurWeights[0];
  for (int i = 1; i <= u_blurRadius; ++i) {
    float w = u_blurWeights[i];
    vec2 offset = vec2(float(i)) * texelSize;
    color += texture(u_prevPassTexture, v_uv + vec2(offset.x, 0.0)) * w;
    color += texture(u_prevPassTexture, v_uv - vec2(offset.x, 0.0)) * w;
  }
  fragColor = color;
}
`;

export const fragmentBgVBlurShader = `#version 300 es

precision highp float;

#define MAX_BLUR_RADIUS (200)

in vec2 v_uv;

uniform sampler2D u_prevPassTexture;
uniform vec2 u_resolution;
uniform int u_blurRadius;
uniform float u_blurWeights[MAX_BLUR_RADIUS + 1];

out vec4 fragColor;

void main() {
  vec2 texelSize = 1.0 / u_resolution;
  vec4 color = texture(u_prevPassTexture, v_uv) * u_blurWeights[0];
  for (int i = 1; i <= u_blurRadius; ++i) {
    float w = u_blurWeights[i];
    vec2 offset = vec2(float(i)) * texelSize;
    color += texture(u_prevPassTexture, v_uv + vec2(0.0, offset.y)) * w;
    color += texture(u_prevPassTexture, v_uv - vec2(0.0, offset.y)) * w;
  }
  fragColor = color;
}
`;

export const fragmentMainShader = `#version 300 es

precision highp float;

#define PI (3.14159265359)

const float N_R = 1.0 - 0.02;
const float N_G = 1.0;
const float N_B = 1.0 + 0.02;

in vec2 v_uv;
uniform sampler2D u_blurredBg;
uniform sampler2D u_bg;
uniform vec2 u_resolution;
uniform float u_dpr;
uniform vec2 u_mouseSpring;
uniform float u_mergeRate;
uniform float u_shapeWidth;
uniform float u_shapeHeight;
uniform float u_shapeRadius;
uniform float u_shapeRoundness;
uniform vec4 u_tint;
uniform float u_refThickness;
uniform float u_refFactor;
uniform float u_refDispersion;
uniform float u_refFresnelRange;
uniform float u_refFresnelFactor;
uniform float u_refFresnelHardness;
uniform float u_glareRange;
uniform float u_glareConvergence;
uniform float u_glareOppositeFactor;
uniform float u_glareFactor;
uniform float u_glareHardness;
uniform float u_glareAngle;
uniform int u_blurEdge;
uniform int u_showShape1;

out vec4 fragColor;

${sdf}
${math}

vec2 getNormal(vec2 p1, vec2 p2, vec2 p) {
  vec2 h = vec2(max(abs(dFdx(p.x)), 0.0001), max(abs(dFdy(p.y)), 0.0001));

  vec2 grad =
    vec2(
      mainSDF(p1, p2, p + vec2(h.x, 0.0)) - mainSDF(p1, p2, p - vec2(h.x, 0.0)),
      mainSDF(p1, p2, p + vec2(0.0, h.y)) - mainSDF(p1, p2, p - vec2(0.0, h.y))
    ) /
    (2.0 * h);

  return grad * 1.414213562 * 1000.0;
}

${color}

float vec2ToAngle(vec2 v) {
  float angle = atan(v.y, v.x);
  if (angle < 0.0) angle += 2.0 * PI;
  return angle;
}

vec4 getTextureDispersion(
  sampler2D tex1,
  sampler2D tex2,
  float mixRate,
  vec2 offset,
  float factor
) {
  vec4 pixel = vec4(1.0);

  float bgR = texture(tex1, v_uv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float bgG = texture(tex1, v_uv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float bgB = texture(tex1, v_uv + offset * (1.0 - (N_B - 1.0) * factor)).b;

  float blurR = texture(tex2, v_uv + offset * (1.0 - (N_R - 1.0) * factor)).r;
  float blurG = texture(tex2, v_uv + offset * (1.0 - (N_G - 1.0) * factor)).g;
  float blurB = texture(tex2, v_uv + offset * (1.0 - (N_B - 1.0) * factor)).b;

  pixel.r = mix(bgR, blurR, mixRate);
  pixel.g = mix(bgG, blurG, mixRate);
  pixel.b = mix(bgB, blurB, mixRate);

  return pixel;
}

void main() {
  vec2 u_resolution1x = u_resolution.xy / u_dpr;
  vec2 p1 = (vec2(0, 0) - u_resolution.xy * 0.5) / u_resolution.y;
  vec2 p2 = (vec2(0, 0) - u_mouseSpring) / u_resolution.y;
  float merged = mainSDF(p1, p2, gl_FragCoord.xy);
  vec4 outColor;

  if (merged < 0.005) {
    float nmerged = -1.0 * (merged * u_resolution1x.y);
    float x_R_ratio = 1.0 - nmerged / u_refThickness;
    float thetaI = safeAsin(pow(x_R_ratio, 2.0));
    float thetaT = safeAsin(1.0 / u_refFactor * sin(thetaI));
    float edgeFactor = -1.0 * tan(thetaT - thetaI);

    if (nmerged >= u_refThickness) {
      edgeFactor = 0.0;
    }

    if (edgeFactor <= 0.0) {
      outColor = texture(u_blurredBg, v_uv);
      outColor = mix(outColor, vec4(u_tint.r, u_tint.g, u_tint.b, 1.0), u_tint.a * 0.8);
    } else {
      float edgeH = nmerged / u_refThickness;
      vec2 normal = getNormal(p1, p2, gl_FragCoord.xy);
      vec4 blurredPixel = getTextureDispersion(
        u_bg,
        u_blurredBg,
        u_blurEdge > 0 ? 1.0 : edgeH,
        -normal *
          edgeFactor *
          0.05 *
          u_dpr *
          vec2(
            u_resolution.y / (u_resolution1x.x * u_dpr),
            1.0
          ),
        u_refDispersion
      );

      outColor = mix(blurredPixel, vec4(u_tint.r, u_tint.g, u_tint.b, 1.0), u_tint.a * 0.8);
      float normalStrength = clamp(length(normal) * 0.08, 0.0, 1.0);
      float softBodySheen =
        smoothstep(0.95, 0.15, v_uv.y) *
        smoothstep(-0.35, 0.75, v_uv.x - v_uv.y + 0.2) *
        0.08;
      outColor.rgb = mix(outColor.rgb, vec3(1.0), softBodySheen);

      float fresnelFactor = clamp(
        pow(
          1.0 +
            merged * u_resolution1x.y / 1500.0 * pow(500.0 / u_refFresnelRange, 2.0) +
            u_refFresnelHardness,
          5.0
        ),
        0.0,
        1.0
      );

      vec3 fresnelTintLCH = SRGB_TO_LCH(
        mix(vec3(1.0), vec3(u_tint.r, u_tint.g, u_tint.b), u_tint.a * 0.5)
      );
      fresnelTintLCH.x += 20.0 * fresnelFactor * u_refFresnelFactor;
      fresnelTintLCH.x = clamp(fresnelTintLCH.x, 0.0, 100.0);

      float fresnelMix =
        clamp(fresnelFactor * u_refFresnelFactor * 0.65 * normalStrength, 0.0, 0.58);
      outColor = mix(
        outColor,
        vec4(clamp(LCH_TO_SRGB(fresnelTintLCH), 0.0, 1.0), 1.0),
        fresnelMix
      );

      float glareGeoFactor = clamp(
        pow(
          1.0 +
            merged * u_resolution1x.y / 1500.0 * pow(500.0 / u_glareRange, 2.0) +
            u_glareHardness,
          5.0
        ),
        0.0,
        1.0
      );

      float glareAngle = (vec2ToAngle(normalize(normal)) - PI / 4.0 + u_glareAngle) * 2.0;
      int glareFarside = 0;
      if (
        glareAngle > PI * (2.0 - 0.5) && glareAngle < PI * (4.0 - 0.5) ||
        glareAngle < PI * (0.0 - 0.5)
      ) {
        glareFarside = 1;
      }
      float glareAngleFactor =
        (0.5 + sin(glareAngle) * 0.5) *
        (glareFarside == 1 ? 1.2 * u_glareOppositeFactor : 1.2) *
        u_glareFactor;
      glareAngleFactor = clamp(pow(glareAngleFactor, 0.1 + u_glareConvergence * 2.0), 0.0, 1.0);

      vec3 glareTintLCH = SRGB_TO_LCH(
        mix(blurredPixel.rgb, vec3(u_tint.r, u_tint.g, u_tint.b), u_tint.a * 0.5)
      );
      glareTintLCH.x += 150.0 * glareAngleFactor * glareGeoFactor;
      glareTintLCH.y += 30.0 * glareAngleFactor * glareGeoFactor;
      glareTintLCH.x = clamp(glareTintLCH.x, 0.0, 120.0);

      float glareMix =
        clamp(glareAngleFactor * glareGeoFactor * 0.72 * normalStrength, 0.0, 0.64);
      outColor = mix(
        outColor,
        vec4(clamp(LCH_TO_SRGB(glareTintLCH), 0.0, 1.0), 1.0),
        glareMix
      );
    }
  } else {
    outColor = texture(u_bg, v_uv);
  }

  outColor = mix(outColor, texture(u_bg, v_uv), smoothstep(-0.001, 0.001, merged));
  fragColor = vec4(clamp(outColor.rgb, 0.0, 1.0), outColor.a);
}
`;
