"use client";

import { useEffect } from "react";

export function CursorAndShutter() {
  useEffect(() => {
    const dot     = document.querySelector<HTMLElement>("[data-cursor-dot]");
    const outline = document.querySelector<HTMLElement>("[data-cursor-outline]");
    if (!dot || !outline) return;

    const onMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top  = `${e.clientY}px`;
      outline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: "forwards" }
      );
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div className="shutter-overlay" id="shutter-overlay">
        <div className="shutter s-top" />
        <div className="shutter s-bottom" />
        <div className="loader-box">
          <div className="loader-text">[ ACCESSING_SERVER ]</div>
          <div className="progress-container">
            <div className="progress-bar" />
          </div>
        </div>
      </div>
      <div className="cursor-dot"     data-cursor-dot />
      <div className="cursor-outline" data-cursor-outline />
    </>
  );
}

export function triggerShutter(callback: () => void) {
  const overlay = document.getElementById("shutter-overlay");
  if (!overlay) { callback(); return; }
  overlay.classList.add("active");
  setTimeout(() => {
    callback();
    setTimeout(() => overlay.classList.remove("active"), 800);
  }, 500);
}
