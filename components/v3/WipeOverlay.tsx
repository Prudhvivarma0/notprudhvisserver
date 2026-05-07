"use client";

interface Props { wiping: boolean; wipeLabel: string; }

export function WipeOverlay({ wiping, wipeLabel }: Props) {
  return (
    <>
      {/* Panel A — slides down carrying label, then away */}
      <div
        className="v3-wipe-panel-a"
        style={{
          transform: wiping ? "translateY(0)" : "translateY(-100%)",
          transition: wiping
            ? "transform 0.7s cubic-bezier(.76,0,.24,1)"
            : "transform 0.7s cubic-bezier(.76,0,.24,1) 0.1s",
          pointerEvents: wiping ? "auto" : "none",
        }}
      >
        <div
          className="v3-display"
          style={{
            fontSize: "clamp(80px, 14vw, 220px)",
            opacity: wiping ? 1 : 0,
            transition: "opacity 0.3s 0.3s",
          }}
        >
          {wipeLabel}
        </div>
      </div>

      {/* Panel B — solid panel that reveals the new section from above */}
      <div
        className="v3-wipe-panel-b"
        style={{
          transform: wiping ? "translateY(100%)" : "translateY(-100%)",
          transition: "transform 0.7s cubic-bezier(.76,0,.24,1) 0.7s",
        }}
      />
    </>
  );
}
