"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges }             from "@react-three/drei";
import * as THREE            from "three";  // needed for Group type ref
import { useTheme }          from "next-themes";

// ── Segment — a single phalanx cylinder ──────────────────────────────────────

function Seg({
  r1, r2, len, color, opacity, accent,
}: {
  r1: number; r2: number; len: number;
  color: string; opacity: number; accent: string;
}) {
  return (
    <mesh position={[0, len / 2, 0]}>
      <cylinderGeometry args={[r1, r2, len, 6, 1]} />
      <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} transparent opacity={opacity} />
      <Edges color={accent} threshold={8} />
    </mesh>
  );
}

// ── Two-joint finger ──────────────────────────────────────────────────────────

function Finger({
  px, py, pz,
  rx, ry, rz,
  proxR1, proxR2, proxLen,
  distLen,
  curl1, curl2,
  color, opacity, accent,
}: {
  px: number; py: number; pz: number;
  rx: number; ry: number; rz: number;
  proxR1: number; proxR2: number; proxLen: number;
  distLen: number;
  curl1: number; curl2: number;
  color: string; opacity: number; accent: string;
}) {
  return (
    <group position={[px, py, pz]} rotation={[rx, ry, rz]}>
      {/* Proximal phalanx */}
      <Seg r1={proxR1} r2={proxR2} len={proxLen} color={color} opacity={opacity} accent={accent} />

      {/* Knuckle → distal phalanx */}
      <group position={[0, proxLen, 0]} rotation={[curl1, 0, 0]}>
        <Seg r1={proxR1 * 0.80} r2={proxR1 * 0.95} len={distLen} color={color} opacity={opacity} accent={accent} />

        {/* Fingertip */}
        <group position={[0, distLen, 0]} rotation={[curl2, 0, 0]}>
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[proxR1 * 0.75, 5, 3]} />
            <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} transparent opacity={opacity} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Complete hand + mouse-follow rotation ─────────────────────────────────────

function Hand({
  mouseRef,
  color, accent,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  color: string; accent: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotRef   = useRef({ x: 0, y: 0 });
  const op = 1.0;

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = (mouseRef.current.y - 0.5) * 0.28;
    const ty = (mouseRef.current.x - 0.5) * 0.45;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = rotRef.current.x;
    groupRef.current.rotation.y = rotRef.current.y;
  });

  // Palm top y = palmY + palmH/2
  const palmY   = -1.20;
  const palmH   = 0.30;
  const palmTop = palmY + palmH / 2;

  // [x, proxLen, distLen, curl1, curl2]
  const fingers: [number, number, number, number, number][] = [
    [ 0.42, 0.36, 0.26, 0.60, 0.55 ],  // index
    [ 0.14, 0.42, 0.30, 0.52, 0.48 ],  // middle
    [-0.14, 0.38, 0.28, 0.55, 0.50 ],  // ring
    [-0.42, 0.28, 0.20, 0.65, 0.58 ],  // pinky
  ];

  return (
    <group ref={groupRef} scale={[1, 1, 1]}>

      {/* Palm */}
      <mesh position={[0, palmY, 0]} rotation={[0.10, 0, 0]}>
        <boxGeometry args={[1.20, palmH, 0.70]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.7} transparent opacity={op} />
        <Edges color={accent} threshold={8} />
      </mesh>

      {/* Four main fingers */}
      {fingers.map(([x, plen, dlen, c1, c2], i) => (
        <Finger
          key={i}
          px={x}      py={palmTop}  pz={0}
          rx={-0.08}  ry={0}        rz={0}
          proxR1={0.048}  proxR2={0.060}  proxLen={plen}
          distLen={dlen}
          curl1={c1}  curl2={c2}
          color={color}  opacity={op}  accent={accent}
        />
      ))}

      {/* Thumb */}
      <Finger
        px={0.68}  py={-1.30}  pz={0.08}
        rx={0.20}  ry={-0.15}  rz={-0.80}
        proxR1={0.050}  proxR2={0.062}  proxLen={0.26}
        distLen={0.20}
        curl1={0.40}  curl2={0.28}
        color={color}  opacity={op}  accent={accent}
      />

    </group>
  );
}

// ── R3F Scene ─────────────────────────────────────────────────────────────────

function Scene({
  mouseRef, isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const color  = isDark ? "#1e2235" : "#ccc8be";
  const accent = isDark ? "#00ffb4" : "#444444";
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <directionalLight position={[3, 5, 3]}   intensity={isDark ? 0.8 : 1.0} />
      <directionalLight position={[-2, -1, -2]} intensity={0.25} />
      <pointLight
        position={[0, 0, 2.5]}
        color={isDark ? "#00ffb4" : "#6677ff"}
        intensity={isDark ? 0.6 : 0.3}
        distance={6}
      />
      <Hand mouseRef={mouseRef} color={color} accent={accent} />
    </>
  );
}

// ── HandGlobe export ──────────────────────────────────────────────────────────

export function HandGlobe() {
  const { resolvedTheme } = useTheme();
  const isDark   = resolvedTheme === "dark";
  const divRef   = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    console.log("HandGlobe mounted — isDark:", isDark);
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
  }, [isDark]);

  return (
    <div
      ref={divRef}
      style={{
        position:      "absolute",
        inset:         0,
        zIndex:        3,          // in front of everything during debug
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        frameloop="always"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      >
        <Scene mouseRef={mouseRef} isDark={isDark} />
      </Canvas>
    </div>
  );
}

export default HandGlobe;
