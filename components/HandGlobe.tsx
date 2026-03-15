"use client";

import { Suspense, useRef, useEffect, Component, ReactNode } from "react";
import { Canvas, useFrame }    from "@react-three/fiber";
import { useGLTF }             from "@react-three/drei";
import * as THREE              from "three";
import { useTheme }            from "next-themes";

const HAND_URL = "/models/hand.glb";

if (typeof window !== "undefined") {
  try { useGLTF.preload(HAND_URL); } catch (_) { /* ignore */ }
}

// ── Hand mesh ─────────────────────────────────────────────────────────────────

function HandMesh({
  mouseRef,
  isDark,
}: {
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const { scene } = useGLTF(HAND_URL);
  const groupRef  = useRef<THREE.Group>(null!);
  const rotRef    = useRef({ x: 0, y: 0 });

  const accent  = isDark ? "#00ffb4" : "#333333";
  const opacity = isDark ? 0.12 : 0.08;

  useEffect(() => {
    if (!groupRef.current) return;

    const cloned = scene.clone(true);
    const mats: THREE.MeshBasicMaterial[] = [];

    // Apply wireframe materials
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

    // Auto-fit: center and scale to 3 units across longest axis
    const box    = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 3.2 / maxDim;
    cloned.position.sub(center);
    cloned.scale.setScalar(scale);

    groupRef.current.add(cloned);

    return () => {
      mats.forEach(m => m.dispose());
      groupRef.current?.remove(cloned);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, isDark]);

  const BASE_X = Math.PI * 0.9;  // preserves palm-down tilt

  useFrame(() => {
    if (!groupRef.current) return;
    const tx = (mouseRef.current.y - 0.5) * 0.40;
    const ty = (mouseRef.current.x - 0.5) * 0.60;
    rotRef.current.x += (tx - rotRef.current.x) * 0.06;
    rotRef.current.y += (ty - rotRef.current.y) * 0.06;
    groupRef.current.rotation.x = BASE_X + rotRef.current.x;
    groupRef.current.rotation.y = rotRef.current.y;
    groupRef.current.rotation.z = Math.PI;
  });

  return <group ref={groupRef} position={[0, 1.5, -1.0]} />;
}

// ── Error boundary ────────────────────────────────────────────────────────────

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

// ── Scene ─────────────────────────────────────────────────────────────────────

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
        camera={{ position: [0, 0, 7], fov: 55 }}
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
