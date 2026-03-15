"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame }           from "@react-three/fiber";
import * as THREE                     from "three";
import { useTheme }                   from "next-themes";

// ── Hand silhouette mesh ──────────────────────────────────────────────────────

function HandMesh({
  mouseRef,
  isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const rotRef   = useRef({ x: 0, y: 0 });

  // Build the hand silhouette once using bezier curves
  const geo = useMemo(() => {
    const s = new THREE.Shape();

    // Wrist (bottom center)
    s.moveTo(0, 0);
    // Left palm edge
    s.bezierCurveTo(-0.8, 0.2,  -1.0, 0.8,  -0.9, 1.4);
    // Pinky finger
    s.bezierCurveTo(-0.85, 1.8, -0.7, 2.2,  -0.65, 2.5);
    s.bezierCurveTo(-0.6,  2.2, -0.55, 1.9, -0.55, 1.6);
    // Ring finger
    s.bezierCurveTo(-0.45, 2.0, -0.35, 2.5, -0.3, 2.8);
    s.bezierCurveTo(-0.25, 2.5, -0.2,  2.1, -0.15, 1.7);
    // Middle finger (tallest)
    s.bezierCurveTo(-0.05, 2.2, 0.05, 2.8, 0.1, 3.1);
    s.bezierCurveTo(0.15,  2.8, 0.2,  2.3, 0.25, 1.8);
    // Index finger
    s.bezierCurveTo(0.35, 2.2, 0.45, 2.6, 0.5, 2.9);
    s.bezierCurveTo(0.55, 2.6, 0.6,  2.2, 0.65, 1.7);
    // Right palm edge
    s.bezierCurveTo(0.8, 1.5, 0.95, 1.0, 0.9, 0.5);
    // Thumb
    s.bezierCurveTo(1.1, 0.8, 1.4, 1.2, 1.5, 1.5);
    s.bezierCurveTo(1.4, 1.1, 1.2, 0.7, 1.0, 0.4);
    // Back to wrist
    s.bezierCurveTo(0.8, 0.1, 0.4, 0, 0, 0);

    return new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: false });
  }, []);

  // Dispose geometry on unmount to free GPU memory
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = (mouseRef.current.y - 0.5) * 0.25;
    const ty = (mouseRef.current.x - 0.5) * 0.40;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = rotRef.current.x;
    groupRef.current.rotation.y = rotRef.current.y;
  });

  const color   = isDark ? "#00ffb4" : "#333333";
  const opacity = isDark ? 0.20 : 0.15;

  return (
    <group ref={groupRef}>
      <mesh
        geometry={geo}
        position={[-0.8, -2.2, -0.5]}
        scale={[1.3, 1.3, 1.3]}
      >
        <meshBasicMaterial wireframe transparent color={color} opacity={opacity} />
      </mesh>
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
  return <HandMesh mouseRef={mouseRef} isDark={isDark} />;
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
