"use client";

import { useEffect, useRef } from "react";

// ── Shaders ────────────────────────────────────────────────────────────────

const VS = `attribute vec2 a; void main(){gl_Position=vec4(a,0.,1.);}`;

const FS = `
precision mediump float;

uniform vec2  uResolution;
uniform float uTime;
uniform int   uScene;
uniform float uBlend;
uniform vec3  uBg;
uniform vec3  uAccent;

#define MAX_STEPS 72
#define MAX_DIST  16.0
#define SURF_DIST 0.001

float sdSphere(vec3 p, float r) { return length(p) - r; }

float sdTorus(vec3 p, vec2 t) {
  return length(vec2(length(p.xz) - t.x, p.y)) - t.y;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdOcta(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}

float sdDTor(vec3 p, vec2 t) {
  float a = sdTorus(p, t);
  float b = sdTorus(vec3(p.y, p.x, p.z), t);
  return min(a, b);
}

float map(vec3 p) {
  float angle = uTime * 0.22;
  float ca = cos(angle), sa = sin(angle);
  vec3 q = vec3(ca * p.x - sa * p.z, p.y, sa * p.x + ca * p.z);

  float d0, d1;
  if (uScene == 0) {
    d0 = sdSphere(q, 1.0);
    d1 = sdTorus(q, vec2(0.65, 0.28));
  } else if (uScene == 1) {
    d0 = sdTorus(q, vec2(0.65, 0.28));
    d1 = sdBox(q, vec3(0.75));
  } else if (uScene == 2) {
    d0 = sdBox(q, vec3(0.75));
    d1 = sdOcta(q, 1.25);
  } else {
    d0 = sdOcta(q, 1.25);
    d1 = sdDTor(q, vec2(0.55, 0.22));
  }

  return mix(d0, d1, uBlend);
}

vec3 calcNormal(vec3 p) {
  const float e = 0.001;
  return normalize(vec3(
    map(p + vec3(e, 0, 0)) - map(p - vec3(e, 0, 0)),
    map(p + vec3(0, e, 0)) - map(p - vec3(0, e, 0)),
    map(p + vec3(0, 0, e)) - map(p - vec3(0, 0, e))
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  vec3 ro  = vec3(0.0, 0.0, 3.8);
  vec3 rd  = normalize(vec3(uv, -1.5));

  float t   = 0.0;
  bool  hit = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    float d = map(ro + rd * t);
    if (d < SURF_DIST) { hit = true; break; }
    if (t > MAX_DIST)  break;
    t += d;
  }

  vec3 col = uBg;

  if (hit) {
    vec3 pos = ro + rd * t;
    vec3 nor = calcNormal(pos);
    vec3 lig = normalize(vec3(1.5, 2.0, 3.0));
    vec3 ref = reflect(rd, nor);

    float diff = max(dot(nor, lig), 0.0);
    float spec = pow(max(dot(ref, lig), 0.0), 48.0);
    float fres = pow(1.0 - abs(dot(-rd, nor)), 3.0);

    vec3 surf = mix(uBg * 1.8 + vec3(0.04), uAccent * 0.5, 0.4);
    col = surf * (0.08 + diff * 0.65)
        + uAccent * spec * 0.5
        + uAccent * fres * 0.35;
    col = mix(col, uBg, clamp(t * 0.06, 0.0, 0.4));
  }

  // Vignette
  float v = 1.0 - dot(uv * 0.65, uv * 0.65);
  col *= mix(0.78, 1.0, clamp(v, 0.0, 1.0));

  // Film grain
  float g = fract(sin(dot(gl_FragCoord.xy + uTime * 7.3, vec2(127.1, 311.7))) * 43758.5453);
  col += (g - 0.5) * 0.022;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

// ── Helpers ────────────────────────────────────────────────────────────────

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function hexToVec3(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (h.length !== 6) return [0, 1, 0.706]; // fallback #00ffb4
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}

// ── Component ──────────────────────────────────────────────────────────────

export function SDFBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Build shader program
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   VS));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1,  1, -1,  -1, 1,  1, 1]),
      gl.STATIC_DRAW,
    );
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uRes   = gl.getUniformLocation(prog, "uResolution");
    const uTime  = gl.getUniformLocation(prog, "uTime");
    const uScene = gl.getUniformLocation(prog, "uScene");
    const uBlend = gl.getUniformLocation(prog, "uBlend");
    const uBg    = gl.getUniformLocation(prog, "uBg");
    const uAcc   = gl.getUniformLocation(prog, "uAccent");

    let scrollY = 0;
    let rafId: number;

    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const resize = () => {
      const dpr    = Math.min(devicePixelRatio, 2);
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();

    const render = () => {
      const t   = (performance.now() - start) / 1000;
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const raw = Math.min(4, (scrollY / max) * 4);

      const scene = Math.min(3, Math.floor(raw));
      const blend = raw - scene; // 0–1

      const isDark = document.documentElement.classList.contains("dark");
      const bgVec: [number, number, number] = isDark
        ? [6 / 255, 8 / 255, 12 / 255]
        : [245 / 255, 244 / 255, 240 / 255];

      const accentHex = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent")
        .trim();
      const acc = hexToVec3(accentHex);

      gl.uniform2f(uRes,    canvas.width, canvas.height);
      gl.uniform1f(uTime,   t);
      gl.uniform1i(uScene,  scene);
      gl.uniform1f(uBlend,  blend);
      gl.uniform3fv(uBg,    bgVec);
      gl.uniform3fv(uAcc,   acc);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll",  onScroll);
      window.removeEventListener("resize",  resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width:  "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
