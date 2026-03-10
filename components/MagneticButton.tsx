"use client";

import { useRef } from "react";

interface Props {
  children: React.ReactNode;
  strength?: number; // max displacement in px, default 4
}

export function MagneticButton({ children, strength = 4 }: Props) {
  const ref    = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const pos    = useRef({ cx: 0, cy: 0 });

  const animateTo = (tx: number, ty: number) => {
    cancelAnimationFrame(rafRef.current);
    const step = () => {
      pos.current.cx += (tx - pos.current.cx) * 0.15;
      pos.current.cy += (ty - pos.current.cy) * 0.15;
      if (ref.current) {
        ref.current.style.transform =
          `translate(${pos.current.cx.toFixed(2)}px, ${pos.current.cy.toFixed(2)}px)`;
      }
      const done =
        Math.abs(tx - pos.current.cx) < 0.05 &&
        Math.abs(ty - pos.current.cy) < 0.05;
      if (!done) rafRef.current = requestAnimationFrame(step);
      else if (ref.current)
        ref.current.style.transform = `translate(${tx}px, ${ty}px)`;
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const tx = ((e.clientX - rect.left - rect.width  / 2) / rect.width)  * strength * 2;
    const ty = ((e.clientY - rect.top  - rect.height / 2) / rect.height) * strength * 2;
    animateTo(
      Math.max(-strength, Math.min(strength, tx)),
      Math.max(-strength, Math.min(strength, ty))
    );
  };

  const onLeave = () => animateTo(0, 0);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: "inline-block", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
