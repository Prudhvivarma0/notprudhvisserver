"use client";

import { Suspense, useRef, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame }    from "@react-three/fiber";
import { useGLTF }             from "@react-three/drei";
import * as THREE              from "three";
import { useTheme }            from "next-themes";

// ── Model path — place your hand GLB at /public/models/hand.glb ──────────────

const HAND_URL = "/models/hand.glb";

// Preload in background (client-side only, silently ignore errors)
if (typeof window !== "undefined") {
  try { useGLTF.preload(HAND_URL); } catch (_) { /* ignore */ }
}

// ── Hand mesh — loads model, converts to wireframe ────────────────────────────

function HandMesh({
  mouseRef,
  isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const { scene } = useGLTF(HAND_URL);
  const groupRef  = useRef<THREE.Group>(null!);
  const centerRef = useRef<THREE.Group>(null!);
  const rotRef    = useRef({ x: 0, y: 0 });

  const accent  = isDark ? "#00ffb4" : "#333333";
  const opacity = isDark ? 0.22 : 0.15;

  // Clone scene, replace all materials with wireframe, add to center group
  useEffect(() => {
    if (!centerRef.current) return;
    const cloned = scene.clone(true);
    const mats: THREE.MeshBasicMaterial[] = [];

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = new THREE.MeshBasicMaterial({
          color:       accent,
          wireframe:   true,
          transparent: true,
          opacity,
        });
        (child as THREE.Mesh).material = mat;
        mats.push(mat);
      }
    });

    centerRef.current.add(cloned);
    return () => {
      mats.forEach(m => m.dispose());
      centerRef.current?.remove(cloned);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, isDark]);

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = (mouseRef.current.y - 0.5) * 0.30;
    const ty = (mouseRef.current.x - 0.5) * 0.50;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = rotRef.current.x - 0.3;
    groupRef.current.rotation.y = rotRef.current.y;
  });

  // Outer group: rotation (mouse-follow) + position + scale
  // Inner group: centers mesh at origin by negating bounding-box center (0.105, 0.267, -0.033)
  return (
    <group ref={groupRef} position={[0, -1.0, 0]} scale={[3.5, 3.5, 3.5]}>
      <group ref={centerRef} position={[-0.105, -0.267, 0.033]} />
    </group>
  );
}

// ── Error boundary — silently swallows model load failures ───────────────────

class GLTFErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    return this.state.error ? (this.props.fallback ?? null) : this.props.children;
  }
}

// ── R3F Scene ─────────────────────────────────────────────────────────────────

function Scene({
  mouseRef, isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.5 : 0.7} />
      <directionalLight position={[3, 5, 3]} intensity={0.8} />
      <GLTFErrorBoundary>
        <Suspense fallback={null}>
          <HandMesh mouseRef={mouseRef} isDark={isDark} />
        </Suspense>
      </GLTFErrorBoundary>
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
