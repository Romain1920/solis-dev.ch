/*
 * Minimal WebGL2 renderer extracted from iyinchao/liquid-glass-studio.
 * Source project is MIT licensed, Copyright (c) 2024 Charles Yin.
 */

import {
  fragmentBgHBlurShader,
  fragmentBgShader,
  fragmentBgVBlurShader,
  fragmentMainShader,
  vertexShader,
} from "./shaders";

const MAX_BLUR_RADIUS = 200;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function computeGaussianKernelByRadius(radius) {
  const safeRadius = clamp(Math.round(radius), 1, MAX_BLUR_RADIUS);
  const sigma = safeRadius / 3;
  const kernel = [];
  let sum = 0;

  for (let i = 0; i <= safeRadius; i += 1) {
    const weight = Math.exp(-0.5 * (i * i) / (sigma * sigma));
    kernel.push(weight);
    sum += i === 0 ? weight : weight * 2;
  }

  const normalized = kernel.map((weight) => weight / sum);
  while (normalized.length <= MAX_BLUR_RADIUS) {
    normalized.push(0);
  }

  return normalized;
}

class ShaderProgram {
  constructor(gl, source) {
    this.gl = gl;
    this.program = this.createProgram(source);
    this.uniforms = new Map();
    this.attributes = new Map();
    this.detectAttributes();
    this.detectUniforms();
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);

    if (!shader) {
      throw new Error("Failed to create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${info}`);
    }

    return shader;
  }

  createProgram(source) {
    const gl = this.gl;
    const program = gl.createProgram();

    if (!program) {
      throw new Error("Failed to create program");
    }

    const vertex = this.createShader(gl.VERTEX_SHADER, source.vertex);
    const fragment = this.createShader(gl.FRAGMENT_SHADER, source.fragment);

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteProgram(program);
      throw new Error(`Program link error: ${info}`);
    }

    gl.deleteShader(vertex);
    gl.deleteShader(fragment);

    return program;
  }

  detectAttributes() {
    const gl = this.gl;
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);

    for (let index = 0; index < count; index += 1) {
      const info = gl.getActiveAttrib(this.program, index);
      if (!info) continue;

      this.attributes.set(info.name, {
        location: gl.getAttribLocation(this.program, info.name),
        size: info.size,
        type: info.type,
      });
    }
  }

  detectUniforms() {
    const gl = this.gl;
    const count = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    const arrayPattern = /\[\d+\]$/;

    for (let index = 0; index < count; index += 1) {
      const info = gl.getActiveUniform(this.program, index);
      if (!info) continue;

      const name = info.name.replace(arrayPattern, "");
      const location = gl.getUniformLocation(this.program, name);
      if (location === null) continue;

      this.uniforms.set(name, {
        location,
        type: info.type,
        isArray: arrayPattern.test(info.name),
      });
    }
  }

  getAttributeLocation(name) {
    return this.attributes.get(name)?.location ?? -1;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  setUniform(name, value) {
    const gl = this.gl;
    const info = this.uniforms.get(name);
    if (!info || value === undefined || value === null) return;

    const location = info.location;
    const isArray = info.isArray || Array.isArray(value) || value instanceof Float32Array;

    if (isArray) {
      switch (info.type) {
        case gl.FLOAT:
          gl.uniform1fv(location, value);
          break;
        case gl.FLOAT_VEC2:
          gl.uniform2fv(location, value);
          break;
        case gl.FLOAT_VEC3:
          gl.uniform3fv(location, value);
          break;
        case gl.FLOAT_VEC4:
          gl.uniform4fv(location, value);
          break;
        default:
          break;
      }
      return;
    }

    switch (info.type) {
      case gl.FLOAT:
        gl.uniform1f(location, value);
        break;
      case gl.FLOAT_VEC2:
        gl.uniform2fv(location, value);
        break;
      case gl.FLOAT_VEC3:
        gl.uniform3fv(location, value);
        break;
      case gl.FLOAT_VEC4:
        gl.uniform4fv(location, value);
        break;
      case gl.INT:
      case gl.SAMPLER_2D:
        gl.uniform1i(location, value);
        break;
      default:
        break;
    }
  }

  dispose() {
    if (this.program) {
      this.gl.deleteProgram(this.program);
      this.program = null;
    }
    this.uniforms.clear();
    this.attributes.clear();
  }
}

class FrameBuffer {
  constructor(gl, width, height) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.fbo = null;
    this.texture = null;
    this.depthTexture = null;
    this.createFramebuffer();
  }

  createFramebuffer() {
    const gl = this.gl;
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    this.depthTexture = gl.createTexture();

    if (!this.fbo || !this.texture || !this.depthTexture) {
      throw new Error("Failed to create framebuffer resources");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA16F,
      this.width,
      this.height,
      0,
      gl.RGBA,
      gl.FLOAT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      this.width,
      this.height,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.DEPTH_ATTACHMENT,
      gl.TEXTURE_2D,
      this.depthTexture,
      0
    );

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error("Framebuffer is incomplete");
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  bind() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
  }

  getTexture() {
    return this.texture;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;

    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, width, height, 0, gl.RGBA, gl.FLOAT, null);

    gl.bindTexture(gl.TEXTURE_2D, this.depthTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.DEPTH_COMPONENT24,
      width,
      height,
      0,
      gl.DEPTH_COMPONENT,
      gl.UNSIGNED_INT,
      null
    );
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteFramebuffer(this.fbo);
    gl.deleteTexture(this.texture);
    gl.deleteTexture(this.depthTexture);
  }
}

class RenderPass {
  constructor(gl, config, outputToScreen = false) {
    this.gl = gl;
    this.config = config;
    this.program = new ShaderProgram(gl, config.shader);
    this.frameBuffer = outputToScreen ? null : new FrameBuffer(gl, gl.canvas.width, gl.canvas.height);
    this.vao = null;
    this.buffer = null;
    this.createVAO();
  }

  createVAO() {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();

    if (!vao || !buffer) {
      throw new Error("Failed to create vertex resources");
    }

    this.vao = vao;
    this.buffer = buffer;

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = this.program.getAttributeLocation("a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(uniforms) {
    const gl = this.gl;

    if (this.frameBuffer) {
      this.frameBuffer.bind();
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.program.use();

    let textureCount = 0;
    Object.entries(uniforms).forEach(([name, value]) => {
      if (value instanceof WebGLTexture) {
        gl.activeTexture(gl.TEXTURE0 + textureCount);
        gl.bindTexture(gl.TEXTURE_2D, value);
        this.program.setUniform(name, textureCount);
        textureCount += 1;
      } else {
        this.program.setUniform(name, value);
      }
    });

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  getOutputTexture() {
    return this.frameBuffer?.getTexture() ?? null;
  }

  resize(width, height) {
    this.frameBuffer?.resize(width, height);
  }

  dispose() {
    this.frameBuffer?.dispose();
    this.program.dispose();
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteVertexArray(this.vao);
  }
}

class MultiPassRenderer {
  constructor(canvas) {
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });

    if (!gl) {
      throw new Error("WebGL2 not supported");
    }

    if (!gl.getExtension("EXT_color_buffer_float")) {
      throw new Error("EXT_color_buffer_float not supported");
    }

    this.gl = gl;
    this.globalUniforms = {};
    this.passes = new Map();
    this.passesArray = [
      new RenderPass(gl, {
        name: "bgPass",
        shader: { vertex: vertexShader, fragment: fragmentBgShader },
      }),
      new RenderPass(gl, {
        name: "vBlurPass",
        shader: { vertex: vertexShader, fragment: fragmentBgVBlurShader },
        inputs: { u_prevPassTexture: "bgPass" },
      }),
      new RenderPass(gl, {
        name: "hBlurPass",
        shader: { vertex: vertexShader, fragment: fragmentBgHBlurShader },
        inputs: { u_prevPassTexture: "vBlurPass" },
      }),
      new RenderPass(
        gl,
        {
          name: "mainPass",
          shader: { vertex: vertexShader, fragment: fragmentMainShader },
          inputs: { u_blurredBg: "hBlurPass", u_bg: "bgPass" },
        },
        true
      ),
    ];

    this.passesArray.forEach((pass) => {
      this.passes.set(pass.config.name, pass);
    });
  }

  resize(width, height) {
    this.passesArray.forEach((pass) => pass.resize(width, height));
  }

  setUniforms(uniforms) {
    Object.assign(this.globalUniforms, uniforms);
  }

  render(passUniforms = {}) {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.passesArray.forEach((pass) => {
      const uniforms = {
        ...this.globalUniforms,
        ...(passUniforms[pass.config.name] ?? {}),
      };

      if (pass.config.inputs) {
        Object.entries(pass.config.inputs).forEach(([uniformName, fromPassName]) => {
          uniforms[uniformName] = this.passes.get(fromPassName)?.getOutputTexture();
        });
      }

      pass.render(uniforms);
    });

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  dispose() {
    this.passesArray.forEach((pass) => pass.dispose());
    this.passes.clear();
    this.globalUniforms = {};
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}

export function canUseLiquidGlassWebGL() {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2");

  if (!gl) return false;

  const supported = Boolean(gl.getExtension("EXT_color_buffer_float"));
  gl.getExtension("WEBGL_lose_context")?.loseContext();

  return supported;
}

export function isLikelyLowEndDevice() {
  if (typeof navigator === "undefined") return false;

  const memory = navigator.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;

  return memory <= 2 || cores <= 2;
}

export function createLiquidGlassRenderer(canvas, preset) {
  const renderer = new MultiPassRenderer(canvas);
  const blurRadius = clamp(Math.round(preset.blur ?? 3), 1, MAX_BLUR_RADIUS);
  const blurWeights = computeGaussianKernelByRadius(blurRadius);
  let size = { width: 1, height: 1, dpr: 1 };

  const resize = ({ width, height, dpr }) => {
    size = {
      width: Math.max(1, width),
      height: Math.max(1, height),
      dpr: Math.max(1, dpr),
    };

    const pixelWidth = Math.max(1, Math.round(size.width * size.dpr));
    const pixelHeight = Math.max(1, Math.round(size.height * size.dpr));

    if (canvas.width !== pixelWidth) {
      canvas.width = pixelWidth;
    }
    if (canvas.height !== pixelHeight) {
      canvas.height = pixelHeight;
    }

    renderer.gl.viewport(0, 0, pixelWidth, pixelHeight);
    renderer.resize(pixelWidth, pixelHeight);
  };

  const render = ({ pointer = { x: 0, y: 0 }, reducedMotion = false } = {}) => {
    const pixelWidth = Math.max(1, Math.round(size.width * size.dpr));
    const pixelHeight = Math.max(1, Math.round(size.height * size.dpr));
    const pointerX = clamp(pointer.x, -1, 1);
    const pointerY = clamp(pointer.y, -1, 1);
    const centerX = pixelWidth * 0.5;
    const centerY = pixelHeight * 0.5;
    const shapeWidth = size.width;
    const shapeHeight = size.height;
    const fallbackRadius = Math.min(shapeWidth, shapeHeight) * clamp(preset.radius ?? 0.5, 0.1, 0.5);
    const shapeRadius = Math.min(preset.cornerRadius ?? fallbackRadius, Math.min(shapeWidth, shapeHeight) * 0.5);
    const glareAngle =
      ((preset.glareAngle ?? -40) + (reducedMotion ? 0 : pointerX * 10 - pointerY * 6)) *
      (Math.PI / 180);

    renderer.setUniforms({
      u_resolution: [pixelWidth, pixelHeight],
      u_dpr: size.dpr,
      u_blurWeights: blurWeights,
      u_blurRadius: blurRadius,
      u_mouseSpring: [centerX, centerY],
      u_shapeWidth: shapeWidth,
      u_shapeHeight: shapeHeight,
      u_shapeRadius: shapeRadius,
      u_shapeRoundness: preset.roundness ?? 5,
      u_mergeRate: 0.01,
      u_showShape1: 0,
    });

    renderer.render({
      bgPass: {
        u_baseColor: preset.baseColor,
        u_accentColor: preset.accentColor,
        u_warmColor: preset.warmColor,
        u_shadowExpand: preset.shadowExpand ?? 24,
        u_shadowFactor: preset.shadowFactor ?? 0.14,
        u_shadowPosition: preset.shadowPosition ?? [0, -8],
        u_pointer: [pointerX, pointerY],
      },
      mainPass: {
        u_tint: preset.tint,
        u_refThickness: preset.thickness ?? 18,
        u_refFactor: preset.distortion ?? 1.32,
        u_refDispersion: preset.chromaticAberration ?? 4.5,
        u_refFresnelRange: preset.fresnelRange ?? 32,
        u_refFresnelHardness: 0.2,
        u_refFresnelFactor: preset.fresnelFactor ?? 0.24,
        u_glareRange: preset.glareRange ?? 30,
        u_glareHardness: 0.2,
        u_glareConvergence: preset.glareConvergence ?? 0.45,
        u_glareOppositeFactor: preset.glareOppositeFactor ?? 0.7,
        u_glareFactor: preset.glare ?? 0.4,
        u_glareAngle: glareAngle,
        u_blurEdge: 1,
      },
    });
  };

  return {
    resize,
    render,
    dispose: () => renderer.dispose(),
  };
}
