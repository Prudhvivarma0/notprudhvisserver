"use client";

import { useEffect, useRef } from "react";

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  reduced?: boolean;
}

export function Magnetic({ children, strength = 0.4, reduced = false }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => {
      el.style.transform = "translate(0,0)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength, reduced]);

  return (
    <span
      ref={ref}
      style={{
        display: "inline-block",
        transition: reduced ? "none" : "transform 0.4s cubic-bezier(.2,.9,.2,1)",
      }}
    >
      {children}
    </span>
  );
}
