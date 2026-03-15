"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges }             from "@react-three/drei";
import * as THREE            from "three";  // needed for Group type
import { useTheme }          from "next-themes";

// ── Shared geometry args (static, created once) ───────────────────────────────

const PALM_ARGS:  [number, number, number]              = [1.55, 0.3, 0.85];
const PROX_ARGS:  [number, number, number, number, number] = [0.055, 0.068, 0, 6, 1]; // filled for tip
const PROX2_ARGS: [number, number, number, number, number] = [0.045, 0.056, 0, 6, 1];
const TIP_ARGS:   [number, number, number, number]      = [0.044, 4, 3, 1];

// ── Segment — a single phalanx cylinder ──────────────────────────────────────

function Seg({
  r1, r2, len, color, opacity, accent,
}: {
  r1: number; r2: number; len: number;
  color: string; opacity: number; accent: string;
}) {
  return (
    <mesh castShadow position={[0, len / 2, 0]}>
      <cylinderGeometry args={[r1, r2, len, 6, 1]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.75} transparent opacity={opacity} />
      <Edges color={accent} threshold={8} />
    </mesh>
  );
}

// ── Two-joint finger ──────────────────────────────────────────────────────────

function Finger({
  px, py, pz,
  rx, ry, rz,
  p1, p2, d1, d2,
  curl1, curl2,
  color, opacity, accent,
}: {
  px: number; py: number; pz: number;
  rx: number; ry: number; rz: number;
  p1: number;  // proximal radius top
  p2: number;  // proximal radius bottom
  d1: number;  // distal length
  d2: number;  // proximal length
  curl1: number;
  curl2: number;
  color: string; opacity: number; accent: string;
}) {
  return (
    <group position={[px, py, pz]} rotation={[rx, ry, rz]}>
      {/* Proximal phalanx */}
      <Seg r1={p1} r2={p2} len={d2} color={color} opacity={opacity} accent={accent} />

      {/* Knuckle joint → distal phalanx */}
      <group position={[0, d2, 0]} rotation={[curl1, 0, 0]}>
        <Seg r1={p1 * 0.78} r2={p2 * 0.92} len={d1} color={color} opacity={opacity} accent={accent} />

        {/* Fingertip cap */}
        <group position={[0, d1, 0]} rotation={[curl2, 0, 0]}>
          <mesh position={[0, 0.035, 0]}>
            <sphereGeometry args={[0.04, 5, 3]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.75} transparent opacity={opacity} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Complete hand mesh + mouse-driven rotation ─────────────────────────────────

function Hand({
  mouseRef,
  isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotRef   = useRef({ x: -0.05, y: 0.0 });

  const color  = isDark ? "#161824" : "#d6d1c8";
  const accent = isDark ? "#00ffb4" : "#3a3a3a";
  const op     = 0.90;

  useFrame(() => {
    if (!groupRef.current) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const tx = (my - 0.5) * 0.28;
    const ty = (mx - 0.5) * 0.45;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = rotRef.current.x;
    groupRef.current.rotation.y = rotRef.current.y;
  });

  // finger data: [x, z, proxLen, distLen, curl1, curl2]
  const fingers: [number, number, number, number, number, number][] = [
    [ 0.52, -0.04, 0.37, 0.28, 0.58, 0.62 ],  // index
    [ 0.17, -0.02, 0.43, 0.32, 0.52, 0.58 ],  // middle
    [-0.17, -0.02, 0.40, 0.30, 0.54, 0.60 ],  // ring
    [-0.52, -0.04, 0.30, 0.23, 0.62, 0.68 ],  // pinky
  ];

  const palmTop = -1.58;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ── Palm ──────────────────────────────────────────────────────────── */}
      <mesh position={[0, -1.73, 0]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={PALM_ARGS} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.75} transparent opacity={op} />
        <Edges color={accent} threshold={8} />
      </mesh>

      {/* ── Four main fingers ─────────────────────────────────────────────── */}
      {fingers.map(([x, z, plen, dlen, c1, c2], i) => (
        <Finger
          key={i}
          px={x}  py={palmTop}  pz={z}
          rx={-0.10}  ry={0}  rz={0}
          p1={0.052}  p2={0.064}
          d1={dlen}   d2={plen}
          curl1={c1}  curl2={c2}
          color={color}  opacity={op}  accent={accent}
        />
      ))}

      {/* ── Thumb ─────────────────────────────────────────────────────────── */}
      <Finger
        px={0.84}  py={-1.65}  pz={0.10}
        rx={0.25}  ry={-0.20}  rz={-0.85}
        p1={0.052}  p2={0.065}
        d1={0.21}   d2={0.27}
        curl1={0.42}  curl2={0.30}
        color={color}  opacity={op}  accent={accent}
      />

    </group>
  );
}

// ── R3F scene ─────────────────────────────────────────────────────────────────

function Scene({
  mouseRef,
  isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const accentLight = isDark ? "#00ffb4" : "#8888ff";
  return (
    <>
      <ambientLight intensity={isDark ? 0.35 : 0.55} />
      <directionalLight position={[3, 5, 3]} intensity={isDark ? 0.7 : 0.9} castShadow={false} />
      <directionalLight position={[-2, -1, -2]} intensity={0.2} />
      <pointLight position={[0, 0.5, 2.5]} color={accentLight} intensity={isDark ? 0.5 : 0.25} distance={5} />
      <Hand mouseRef={mouseRef} isDark={isDark} />
    </>
  );
}

// ── HandGlobe export ──────────────────────────────────────────────────────────

export function HandGlobe() {
  const { resolvedTheme } = useTheme();
  const isDark   = resolvedTheme === "dark";
  const divRef   = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Track mouse globally — stays active even when the 2D globe canvas is on top
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const rect = divRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current = {
        x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (e.clientY - rect.top)  / rect.height)),
      };
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={divRef}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        frameloop="always"
        style={{ background: "transparent" }}
      >
        <Scene mouseRef={mouseRef} isDark={isDark} />
      </Canvas>
    </div>
  );
}
