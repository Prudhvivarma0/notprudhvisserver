"use client";

import { useEffect, useRef, useState } from "react";

const POINTS = [
  { lat: 17.385, lon: 78.486, label: "HYD" },
  { lat: 25.276, lon: 55.296, label: "DXB" },
  { lat: 51.507, lon: -0.127, label: "LON" },
  { lat: 40.712, lon: -74.005, label: "NYC" },
  { lat: 35.689, lon: 139.691, label: "TYO" },
  { lat: -33.868, lon: 151.209, label: "SYD" },
  { lat: 1.352, lon: 103.819, label: "SIN" },
  { lat: 37.774, lon: -122.419, label: "SFO" },
  { lat: 52.520, lon: 13.405, label: "BER" },
  { lat: -23.550, lon: -46.633, label: "SAO" },
  { lat: 19.076, lon: 72.877, label: "BOM" },
  { lat: 48.856, lon: 2.352, label: "PAR" },
];

interface Props { size?: number; dark?: boolean; reduced?: boolean; }

export function LiveGlobe({ size = 560, dark = false, reduced = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ rx: 0, tx: 0, peers: 0, lat: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = `${size}px`;
    canvas.style.height = `${size}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2, R = size * 0.42;
    let rot = 0;
    let raf: number;
    const beams: { from: number; to: number; t: number }[] = [];
    let beamTimer = 0;

    const project = (lat: number, lon: number) => {
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = (lon + rot) * Math.PI / 180;
      const x = R * Math.sin(phi) * Math.cos(theta);
      const y = -R * Math.cos(phi);
      const z = R * Math.sin(phi) * Math.sin(theta);
      return { x: cx + x, y: cy + y, z, visible: z > -R * 0.05 };
    };

    const toVec = (lat: number, lon: number): [number, number, number] => {
      const phi   = (90 - lat) * Math.PI / 180;
      const theta = lon * Math.PI / 180;
      return [Math.sin(phi) * Math.cos(theta), -Math.cos(phi), Math.sin(phi) * Math.sin(theta)];
    };

    const greatCircle = (a: typeof POINTS[0], b: typeof POINTS[0], t: number) => {
      const va = toVec(a.lat, a.lon);
      const vb = toVec(b.lat, b.lon);
      const dot = va[0]*vb[0] + va[1]*vb[1] + va[2]*vb[2];
      const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (omega < 1e-3) return va;
      const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s2 = Math.sin(t * omega) / Math.sin(omega);
      const lift = 1 + 0.18 * Math.sin(t * Math.PI);
      return [
        (va[0]*s1 + vb[0]*s2) * lift,
        (va[1]*s1 + vb[1]*s2) * lift,
        (va[2]*s1 + vb[2]*s2) * lift,
      ] as [number, number, number];
    };

    const projectVec = (v: [number, number, number]) => {
      const theta = rot * Math.PI / 180;
      const cs = Math.cos(theta), sn = Math.sin(theta);
      const x = v[0]*cs + v[2]*sn;
      const z = -v[0]*sn + v[2]*cs;
      return { x: cx + x*R, y: cy + v[1]*R, z: z*R };
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const ink       = dark ? "#ffffff" : "#0a0a0a";
      const mute      = dark ? "rgba(255,255,255,0.18)" : "rgba(10,10,10,0.18)";
      const muteLight = dark ? "rgba(255,255,255,0.08)" : "rgba(10,10,10,0.08)";

      // Outer ring
      ctx.strokeStyle = mute;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      // Latitude ellipses
      ctx.strokeStyle = muteLight;
      for (let lat = -60; lat <= 60; lat += 30) {
        const ry = R * Math.sin(lat * Math.PI / 180);
        const rr = R * Math.cos(lat * Math.PI / 180);
        ctx.beginPath();
        ctx.ellipse(cx, cy - ry, rr, rr * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude lines (rotating with globe)
      for (let lon = 0; lon < 180; lon += 20) {
        const theta = (lon + rot) * Math.PI / 180;
        const rx = R * Math.abs(Math.cos(theta));
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Land dots
      ctx.fillStyle = mute;
      for (let i = 0; i < 380; i++) {
        const u = ((i * 9301 + 49297) % 233280) / 233280;
        const v = ((i * 16807) % 200000) / 200000;
        const lat = (v - 0.5) * 180;
        const lon = u * 360 - 180;
        const p = project(lat, lon);
        if (p.visible) {
          const a = (p.z + R) / (2 * R);
          ctx.globalAlpha = 0.15 + 0.5 * a;
          ctx.fillRect(p.x, p.y, 1.2, 1.2);
        }
      }
      ctx.globalAlpha = 1;

      // Named endpoints
      POINTS.forEach(pt => {
        const p = project(pt.lat, pt.lon);
        if (p.visible) {
          const a = (p.z + R) / (2 * R);
          ctx.fillStyle = ink;
          ctx.globalAlpha = 0.4 + 0.6 * a;
          ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
          if (a > 0.7) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.stroke();
          }
        }
      });
      ctx.globalAlpha = 1;

      // Beams
      for (let i = beams.length - 1; i >= 0; i--) {
        const beam = beams[i];
        beam.t += 0.012;
        if (beam.t > 1.1) { beams.splice(i, 1); continue; }
        const a = POINTS[beam.from], b = POINTS[beam.to];
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;
        for (let s = 0; s < 32; s++) {
          const t1 = s / 32, t2 = (s + 1) / 32;
          if (t2 > beam.t) break;
          const tail = Math.max(0, beam.t - 0.35);
          if (t1 < tail) continue;
          const v1 = greatCircle(a, b, t1);
          const v2 = greatCircle(a, b, t2);
          const p1 = projectVec(v1), p2 = projectVec(v2);
          const alpha = 1 - Math.max(0, beam.t - t2) / 0.35;
          ctx.globalAlpha = Math.max(0, alpha) * 0.9;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
        if (beam.t <= 1) {
          const head = greatCircle(a, b, Math.min(1, beam.t));
          const ph = projectVec(head);
          ctx.globalAlpha = 1;
          ctx.fillStyle = ink;
          ctx.beginPath(); ctx.arc(ph.x, ph.y, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!reduced) rot += 0.18;

      // Spawn beams
      beamTimer++;
      if (beamTimer > 40 && beams.length < 5) {
        beamTimer = 0;
        let f = Math.floor(Math.random() * POINTS.length);
        let t = Math.floor(Math.random() * POINTS.length);
        while (t === f) t = Math.floor(Math.random() * POINTS.length);
        beams.push({ from: f, to: t, t: 0 });
        setStats(s => ({
          rx:    s.rx + Math.floor(Math.random() * 40 + 20),
          tx:    s.tx + Math.floor(Math.random() * 30 + 10),
          peers: 4 + beams.length,
          lat:   18 + Math.floor(Math.random() * 30),
        }));
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [size, dark, reduced]);

  const hudColor = dark ? "rgba(255,255,255,0.6)" : "rgba(10,10,10,0.55)";
  const hudStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: "var(--font-jetbrains, 'JetBrains Mono', monospace)",
    fontSize: 10,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: hudColor,
    lineHeight: 1.8,
  };

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <canvas ref={canvasRef} />
      <div style={{ ...hudStyle, top: 0, left: 0 }}>
        <div>● LIVE</div>
        <div>NODE / HYD-01</div>
      </div>
      <div style={{ ...hudStyle, top: 0, right: 0, textAlign: "right" }}>
        <div>PEERS / {String(stats.peers).padStart(2, "0")}</div>
        <div>LAT / {stats.lat}ms</div>
      </div>
      <div style={{ ...hudStyle, bottom: 0, left: 0 }}>
        <div>RX / {(stats.rx / 1000).toFixed(2)} MB</div>
        <div>TX / {(stats.tx / 1000).toFixed(2)} MB</div>
      </div>
      <div style={{ ...hudStyle, bottom: 0, right: 0, textAlign: "right" }}>
        <div>FIG. 01</div>
        <div>TRANSMISSIONS</div>
      </div>
    </div>
  );
}
