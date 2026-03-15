"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE            from "three";
import { useTheme }          from "next-themes";

// ── Wireframe segment ─────────────────────────────────────────────────────────

function Seg({
  r1, r2, len, color, opacity,
}: {
  r1: number; r2: number; len: number; color: string; opacity: number;
}) {
  return (
    <mesh position={[0, len / 2, 0]}>
      <cylinderGeometry args={[r1, r2, len, 6, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

// ── Two-joint finger ──────────────────────────────────────────────────────────

function Finger({
  px, py, pz,
  rx, ry, rz,
  proxR, proxLen,
  distLen,
  curl1, curl2,
  color, opacity,
}: {
  px: number; py: number; pz: number;
  rx: number; ry: number; rz: number;
  proxR: number; proxLen: number;
  distLen: number;
  curl1: number; curl2: number;
  color: string; opacity: number;
}) {
  return (
    <group position={[px, py, pz]} rotation={[rx, ry, rz]}>
      <Seg r1={proxR * 0.85} r2={proxR} len={proxLen} color={color} opacity={opacity} />
      <group position={[0, proxLen, 0]} rotation={[curl1, 0, 0]}>
        <Seg r1={proxR * 0.70} r2={proxR * 0.85} len={distLen} color={color} opacity={opacity} />
        <group position={[0, distLen, 0]} rotation={[curl2, 0, 0]}>
          <mesh position={[0, proxR * 0.6, 0]}>
            <sphereGeometry args={[proxR * 0.65, 5, 3]} />
            <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ── Complete hand + mouse-follow ──────────────────────────────────────────────

function Hand({
  mouseRef, color, opacity,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  color: string; opacity: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotRef   = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = (mouseRef.current.y - 0.5) * 0.28;
    const ty = (mouseRef.current.x - 0.5) * 0.45;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = rotRef.current.x;
    groupRef.current.rotation.y = rotRef.current.y;
  });

  const palmH   = 0.28;
  const palmY   = -0.50;
  const palmTop = palmY + palmH / 2;

  // [x, proxLen, distLen, curl1, curl2, spread-z]
  const fingers: [number, number, number, number, number, number][] = [
    [ 0.40, 0.38, 0.26, 1.05, 0.80, -0.03 ],  // index
    [ 0.13, 0.44, 0.30, 0.95, 0.72, -0.01 ],  // middle
    [-0.13, 0.40, 0.28, 1.00, 0.76, -0.01 ],  // ring
    [-0.40, 0.30, 0.20, 1.10, 0.85, -0.03 ],  // pinky
  ];

  return (
    // scale + lift the whole hand so it wraps the globe
    <group ref={groupRef} position={[0, 0.30, 0]} scale={[2.2, 2.2, 2.2]}>

      {/* Palm */}
      <mesh position={[0, palmY, -0.28]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[1.10, palmH, 0.62]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>

      {/* Four main fingers */}
      {fingers.map(([x, plen, dlen, c1, c2, z], i) => (
        <Finger
          key={i}
          px={x}      py={palmTop}  pz={z}
          rx={-0.12}  ry={0}        rz={0}
          proxR={0.052}  proxLen={plen}
          distLen={dlen}
          curl1={c1}  curl2={c2}
          color={color}  opacity={opacity}
        />
      ))}

      {/* Thumb */}
      <Finger
        px={0.62}  py={-0.58}  pz={-0.10}
        rx={0.22}  ry={-0.18}  rz={-0.82}
        proxR={0.054}  proxLen={0.28}
        distLen={0.22}
        curl1={0.75}  curl2={0.55}
        color={color}  opacity={opacity}
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
  const color   = isDark ? "#00ffb4" : "#333333";
  const opacity = isDark ? 0.28 : 0.18;
  return (
    <>
      {/* No lights needed — meshBasicMaterial is unlit */}
      <Hand mouseRef={mouseRef} color={color} opacity={opacity} />
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
      style={{
        position:      "absolute",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
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
