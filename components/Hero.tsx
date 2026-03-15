"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MagneticButton } from "@/components/MagneticButton";
import dynamic            from "next/dynamic";

const HandGlobe = dynamic(
  () => import("@/components/HandGlobe").then(m => m.HandGlobe),
  { ssr: false }
);

// ── Types ──────────────────────────────────────────────────────────────────────

type NodeStatus = "operational" | "degraded" | "outage";
type Provider   = "aws" | "gcp" | "azure" | "cloudflare";

interface CloudNode {
  id:       string;
  label:    string;
  provider: Provider;
  lat:      number;
  lon:      number;
  status:   NodeStatus;
  region:   string;
}

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
}

interface CFComponent {
  name:     string;
  status:   string;
  group_id: string | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<NodeStatus, string> = {
  operational: "#00ffb4",
  degraded:    "#ffd700",
  outage:      "#ff4444",
};

const PROVIDER_LABEL: Record<Provider, string> = {
  aws:        "Amazon Web Services",
  gcp:        "Google Cloud Platform",
  azure:      "Microsoft Azure",
  cloudflare: "Cloudflare",
};

const INITIAL_NODES: CloudNode[] = [
  // AWS
  { id: "aws-use1",  label: "us-east-1",    provider: "aws",        lat:  38.95, lon:  -77.45, status: "operational", region: "N. Virginia, USA"       },
  { id: "aws-usw2",  label: "us-west-2",    provider: "aws",        lat:  45.52, lon: -122.68, status: "operational", region: "Oregon, USA"             },
  { id: "aws-euw1",  label: "eu-west-1",    provider: "aws",        lat:  53.34, lon:   -6.26, status: "operational", region: "Dublin, Ireland"         },
  { id: "aws-apse1", label: "ap-se-1",      provider: "aws",        lat:   1.35, lon:  103.82, status: "operational", region: "Singapore"               },
  { id: "aws-apne1", label: "ap-ne-1",      provider: "aws",        lat:  35.69, lon:  139.69, status: "operational", region: "Tokyo, Japan"            },
  { id: "aws-sae1",  label: "sa-east-1",    provider: "aws",        lat: -23.55, lon:  -46.63, status: "operational", region: "São Paulo, Brazil"       },
  { id: "aws-aps1",  label: "ap-south-1",   provider: "aws",        lat:  19.08, lon:   72.88, status: "operational", region: "Mumbai, India"           },
  { id: "aws-euc1",  label: "eu-central-1", provider: "aws",        lat:  50.11, lon:    8.68, status: "operational", region: "Frankfurt, Germany"      },
  // GCP
  { id: "gcp-usc1",  label: "us-central1",  provider: "gcp",        lat:  41.60, lon:  -93.60, status: "operational", region: "Iowa, USA"               },
  { id: "gcp-euw1",  label: "europe-west1", provider: "gcp",        lat:  50.85, lon:    4.35, status: "operational", region: "Belgium"                 },
  { id: "gcp-aee1",  label: "asia-east1",   provider: "gcp",        lat:  25.03, lon:  121.57, status: "operational", region: "Taiwan"                  },
  { id: "gcp-ause1", label: "aus-se1",      provider: "gcp",        lat: -33.87, lon:  151.21, status: "operational", region: "Sydney, Australia"       },
  // Azure
  { id: "az-eus",    label: "eastus",       provider: "azure",      lat:  37.38, lon:  -79.46, status: "operational", region: "Virginia, USA"           },
  { id: "az-weu",    label: "westeurope",   provider: "azure",      lat:  52.37, lon:    4.90, status: "operational", region: "Amsterdam, Netherlands"  },
  { id: "az-sea",    label: "se-asia",      provider: "azure",      lat:   1.28, lon:  103.84, status: "operational", region: "Singapore"               },
  { id: "az-wus2",   label: "westus2",      provider: "azure",      lat:  47.61, lon: -122.33, status: "operational", region: "Washington, USA"         },
  // Cloudflare PoPs
  { id: "cf-lax",    label: "LAX",          provider: "cloudflare", lat:  34.05, lon: -118.24, status: "operational", region: "Los Angeles, USA"        },
  { id: "cf-lhr",    label: "LHR",          provider: "cloudflare", lat:  51.51, lon:   -0.13, status: "operational", region: "London, UK"              },
  { id: "cf-sin",    label: "SIN",          provider: "cloudflare", lat:   1.40, lon:  103.80, status: "operational", region: "Singapore"               },
  { id: "cf-nrt",    label: "NRT",          provider: "cloudflare", lat:  35.55, lon:  139.80, status: "operational", region: "Tokyo, Japan"            },
  { id: "cf-fra",    label: "FRA",          provider: "cloudflare", lat:  50.05, lon:    8.75, status: "operational", region: "Frankfurt, Germany"      },
  { id: "cf-syd",    label: "SYD",          provider: "cloudflare", lat: -33.95, lon:  151.15, status: "operational", region: "Sydney, Australia"       },
];

const GLOBE_SIZE   = 420;
const TYPING_WORDS = ["architect", "developer", "entrepreneur"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCSSVar(name: string): string {
  if (typeof window === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function getTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function mapCFStatus(raw: string): NodeStatus {
  if (raw === "operational") return "operational";
  if (raw === "major_outage") return "outage";
  return "degraded";
}

function angularDeg(a: CloudNode, b: CloudNode): number {
  const r   = (d: number) => (d * Math.PI) / 180;
  const dot = Math.max(-1, Math.min(1,
    Math.sin(r(a.lat)) * Math.sin(r(b.lat)) +
    Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.cos(r(b.lon) - r(a.lon))
  ));
  return Math.acos(dot) * (180 / Math.PI);
}

// ── useTypingEffect ───────────────────────────────────────────────────────────

function useTypingEffect(words: string[]): string {
  const [display,    setDisplay]    = useState("");
  const [wordIdx,    setWordIdx]    = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused,   setIsPaused]   = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    if (isPaused) {
      const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 1500);
      return () => clearTimeout(t);
    }
    if (!isDeleting && display === word) { setIsPaused(true); return; }
    if (isDeleting  && display === "")  { setIsDeleting(false); setWordIdx(i => (i + 1) % words.length); return; }
    const t = setTimeout(() => {
      setDisplay(isDeleting ? display.slice(0, -1) : word.slice(0, display.length + 1));
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(t);
  }, [display, wordIdx, isDeleting, isPaused, words]);

  return display;
}

// ── useCloudStatus ────────────────────────────────────────────────────────────

function useCloudStatus() {
  const [nodes, setNodes] = useState<CloudNode[]>(INITIAL_NODES);
  const [logs,  setLogs]  = useState<string[]>([]);

  // Seed initial log lines client-side only to avoid timestamp hydration mismatch
  useEffect(() => {
    setLogs([
      `[${getTime()}] Cloud telemetry initialized`,
      `[${getTime()}] Connecting to Cloudflare status API...`,
    ]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const [statusRes, compRes] = await Promise.all([
          fetch("https://www.cloudflarestatus.com/api/v2/status.json"),
          fetch("https://www.cloudflarestatus.com/api/v2/components.json"),
        ]);
        if (!statusRes.ok || !compRes.ok) throw new Error("non-ok");

        const statusData: { status: { indicator: string; description: string } } =
          await statusRes.json();
        const compData: { components: CFComponent[] } =
          await compRes.json();

        if (cancelled) return;

        const time      = getTime();
        const newLogs: string[] = [];
        const indicator = statusData.status.indicator;
        const cfStatus  = mapCFStatus(indicator === "none" ? "operational" : indicator);

        newLogs.push(`[${time}] Overall: ${statusData.status.description}`);

        const topLevel = compData.components.filter(c => c.group_id === null).slice(0, 6);
        for (const c of topLevel) {
          const label =
            c.status === "operational"          ? "Operational"  :
            c.status === "degraded_performance" ? "Degraded"     :
            c.status === "partial_outage"       ? "Partial Out." :
            c.status === "major_outage"         ? "Major Outage" :
            c.status === "under_maintenance"    ? "Maintenance"  : c.status;
          newLogs.push(`[${time}] ${c.name} — ${label}`);
        }

        setNodes(prev => prev.map(n => n.provider === "cloudflare" ? { ...n, status: cfStatus } : n));
        setLogs(prev => [...prev, ...newLogs].slice(-30));
      } catch {
        if (!cancelled)
          setLogs(prev => [...prev, `[${getTime()}] API unreachable — cached data`].slice(-30));
      }
    };

    poll();
    const id = setInterval(poll, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return { nodes, logs };
}

// ── ParticleCanvas ────────────────────────────────────────────────────────────

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const raw = canvas.getContext("2d");
    if (!raw) return;
    const ctx = raw;

    let rafId: number;
    let mouse      = { x: -9999, y: -9999 };
    let particles: Particle[] = [];

    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: 60 }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      }));
    };

    const onResize = () => init();
    const onMove   = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };

    init();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      const accent = getCSSVar("--accent") || "#00ffb4";
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 100 && d > 0) { p.x += (dx / d) * 1.5; p.y += (dy / d) * 1.5; }
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = accent; ctx.globalAlpha = (1 - d / 130) * 0.12; ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = accent; ctx.globalAlpha = 0.2; ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── GlobeCanvas ───────────────────────────────────────────────────────────────

function GlobeCanvas({
  nodes,
  onHoverChange,
}: {
  nodes: CloudNode[];
  onHoverChange: (node: CloudNode | null, x: number, y: number) => void;
}) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<CloudNode[]>(nodes);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  // Stable ref so the main effect never needs to re-run when the callback identity changes
  const hoverRef = useRef(onHoverChange);
  useEffect(() => { hoverRef.current = onHoverChange; }, [onHoverChange]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const raw = canvas.getContext("2d");
    if (!raw) return;
    const ctx = raw;

    const S  = GLOBE_SIZE;
    const R  = S * 0.38;
    const cx = S / 2;
    const cy = S / 2;

    let rafId:  number;
    let theta:  number = 0;
    let mouseX: number = 0;   // normalized for globe rotation
    let mouseY: number = 0;
    let clientX: number = -9999;  // raw client coords for hover
    let clientY: number = -9999;
    let canvasRect = canvas.getBoundingClientRect();
    let lastHoveredId: string | null = null;

    function project(lat: number, lon: number) {
      const phi  = (lat * Math.PI) / 180;
      const lam  = (lon * Math.PI) / 180 + theta;
      const x    = Math.cos(phi) * Math.cos(lam);
      const y    = Math.sin(phi);
      const z    = Math.cos(phi) * Math.sin(lam);
      const tilt = mouseY * 0.35;
      const y2   = y * Math.cos(tilt) - z * Math.sin(tilt);
      const z2   = y * Math.sin(tilt) + z * Math.cos(tilt);
      return { sx: cx + R * x, sy: cy - R * y2, z: z2 };
    }

    function strokeArc(pairs: [number, number][]) {
      let pen = false;
      ctx.beginPath();
      for (const [lat, lon] of pairs) {
        const { sx, sy, z } = project(lat, lon);
        if (z > -0.05) {
          if (!pen) { ctx.moveTo(sx, sy); pen = true; }
          else        ctx.lineTo(sx, sy);
        } else { pen = false; }
      }
      ctx.stroke();
    }

    const onMouseMove = (e: MouseEvent) => {
      canvasRect  = canvas.getBoundingClientRect();
      const scale = S / canvasRect.width;
      mouseX  = ((e.clientX - canvasRect.left) * scale - cx) / S;
      mouseY  = ((e.clientY - canvasRect.top)  * scale - cy) / S;
      clientX = e.clientX;
      clientY = e.clientY;
    };

    const onResize = () => { canvasRect = canvas.getBoundingClientRect(); };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize",    onResize);

    const draw = () => {
      const accent    = getCSSVar("--accent") || "#00ffb4";
      const textColor = getCSSVar("--text")   || "#e8ecf4";
      const bgColor   = getCSSVar("--bg")     || "#06080c";
      const isDark    = document.documentElement.classList.contains("dark");
      const nodeR     = isDark ? 6 : 7;
      ctx.clearRect(0, 0, S, S);
      theta += 0.003 + mouseX * 0.003;

      // ── Grid ──────────────────────────────────────────────────────────────
      ctx.strokeStyle = accent; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.13;
      for (let lat = -80; lat <= 80; lat += 20) {
        const pts: [number, number][] = [];
        for (let lon = 0; lon <= 360; lon += 3) pts.push([lat, lon]);
        strokeArc(pts);
      }
      for (let lon = 0; lon < 360; lon += 20) {
        const pts: [number, number][] = [];
        for (let lat = -90; lat <= 90; lat += 3) pts.push([lat, lon]);
        strokeArc(pts);
      }
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = accent; ctx.globalAlpha = 0.28; ctx.lineWidth = 1; ctx.stroke();

      // ── Project all nodes ─────────────────────────────────────────────────
      const ns        = nodesRef.current;
      const projected = ns.map(n => ({ ...project(n.lat, n.lon), node: n }));

      // ── Connection lines ──────────────────────────────────────────────────
      ctx.lineWidth = 0.5;
      for (let i = 0; i < ns.length; i++) {
        for (let j = i + 1; j < ns.length; j++) {
          if (projected[i].z > 0 && projected[j].z > 0 && angularDeg(ns[i], ns[j]) < 55) {
            ctx.beginPath();
            ctx.moveTo(projected[i].sx, projected[i].sy);
            ctx.lineTo(projected[j].sx, projected[j].sy);
            ctx.strokeStyle = accent; ctx.globalAlpha = 0.08; ctx.stroke();
          }
        }
      }

      // ── Nodes + labels ────────────────────────────────────────────────────
      ctx.font = "bold 11px 'Courier New', monospace";
      const pillBg = isDark
        ? "rgba(6,8,12,0.85)"
        : "rgba(245,244,240,0.9)";
      for (let i = 0; i < ns.length; i++) {
        const { sx, sy, z } = projected[i];
        if (z <= 0) continue;
        const color = STATUS_COLOR[ns[i].status];

        // Solid filled dot
        ctx.beginPath();
        ctx.arc(sx, sy, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.globalAlpha = 1; ctx.fill();

        // Border ring
        ctx.beginPath();
        ctx.arc(sx, sy, nodeR, 0, Math.PI * 2);
        ctx.strokeStyle = textColor; ctx.globalAlpha = 0.45; ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label: pill bg + text (12px gap from node edge)
        const labelText = ns[i].label;
        const tw  = ctx.measureText(labelText).width;
        const px  = sx + nodeR + 12;
        const py  = sy + 4;
        const padH = 5, padV = 4;
        const rx  = px - padH;
        const ry  = py - 11 - padV + 2;
        const rw  = tw + padH * 2;
        const rh  = 11 + padV * 2 - 2;
        const rr  = 4;

        ctx.globalAlpha = 1; ctx.fillStyle = pillBg;
        ctx.beginPath();
        ctx.moveTo(rx + rr, ry);
        ctx.lineTo(rx + rw - rr, ry);
        ctx.quadraticCurveTo(rx + rw, ry,      rx + rw, ry + rr);
        ctx.lineTo(rx + rw, ry + rh - rr);
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - rr, ry + rh);
        ctx.lineTo(rx + rr, ry + rh);
        ctx.quadraticCurveTo(rx, ry + rh,      rx, ry + rh - rr);
        ctx.lineTo(rx, ry + rr);
        ctx.quadraticCurveTo(rx, ry,            rx + rr, ry);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = textColor; ctx.globalAlpha = 0.9;
        ctx.fillText(labelText, px, py);
      }

      // ── Hover detection ───────────────────────────────────────────────────
      const cssScale    = canvasRect.width / S;
      let nearest: CloudNode | null = null;
      let nearestDist   = 20; // px threshold in CSS space

      for (let i = 0; i < ns.length; i++) {
        const { sx, sy, z } = projected[i];
        if (z <= 0) continue;
        const nodeCx = canvasRect.left + sx * cssScale;
        const nodeCy = canvasRect.top  + sy * cssScale;
        const d = Math.hypot(clientX - nodeCx, clientY - nodeCy);
        if (d < nearestDist) { nearestDist = d; nearest = ns[i]; }
      }

      const newId = nearest?.id ?? null;
      if (newId !== lastHoveredId) {
        lastHoveredId = newId;
        hoverRef.current(nearest, clientX, clientY);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
    };
  }, []);

  return (
    <canvas ref={ref} width={GLOBE_SIZE} height={GLOBE_SIZE} className="w-full max-w-[420px]" />
  );
}

// ── NodeTooltip ───────────────────────────────────────────────────────────────

function NodeTooltip({ node, x, y }: { node: CloudNode; x: number; y: number }) {
  // Prevent right-edge overflow: flip left if too close to right side
  const flipped = typeof window !== "undefined" && x + 200 > window.innerWidth;

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: flipped ? x - 188 : x + 16, top: y - 56 }}
    >
      <div
        className="rounded-lg px-3 py-2.5 min-w-[168px]"
        style={{
          background:           "var(--bg-card)",
          backdropFilter:       "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border:               "1px solid var(--muted)",
        }}
      >
        <p className="font-mono text-xs font-semibold mb-0.5" style={{ color: "var(--text)" }}>
          {node.label}
        </p>
        <p className="font-sans text-[11px] leading-snug mb-0.5" style={{ color: "var(--muted)" }}>
          {PROVIDER_LABEL[node.provider]}
        </p>
        <p className="font-sans text-[11px] leading-snug mb-2" style={{ color: "var(--muted)" }}>
          {node.region}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: STATUS_COLOR[node.status] }} />
          <span className="font-mono text-[10px] font-semibold" style={{ color: STATUS_COLOR[node.status] }}>
            {node.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const [mounted, setMounted]      = useState(false);
  const [showHand, setShowHand]    = useState(false);
  const typed                      = useTypingEffect(TYPING_WORDS);
  const [cursorOn, setCursorOn]    = useState(true);
  const { nodes, logs }            = useCloudStatus();
  const logEndRef                  = useRef<HTMLDivElement>(null);
  const logContainerRef            = useRef<HTMLDivElement>(null);

  const [hoveredNode, setHoveredNode] = useState<CloudNode | null>(null);
  const [tooltipPos,  setTooltipPos]  = useState({ x: 0, y: 0 });

  const handleHoverChange = useCallback((node: CloudNode | null, x: number, y: number) => {
    setHoveredNode(node);
    if (node) setTooltipPos({ x, y });
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Only render the heavy R3F hand on desktop (≥ 768px)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setShowHand(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShowHand(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14">
      <ParticleCanvas />

      {/* Node tooltip — rendered at fixed viewport position */}
      {hoveredNode && (
        <NodeTooltip node={hoveredNode} x={tooltipPos.x} y={tooltipPos.y} />
      )}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 flex flex-wrap items-center gap-12 lg:gap-20">

        {/* ── Left ─────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-[280px] reveal">
          <h1
            className="font-display font-extrabold leading-[0.93] tracking-tight mb-5"
            style={{ fontSize: "clamp(40px, 8vw, 96px)", color: "var(--text)" }}
          >
            Prudhvi<br />Varma
          </h1>

          <div className="font-mono text-xl mb-6 flex items-center h-8" style={{ color: "var(--accent)" }}>
            <span>{typed}</span>
            <span style={{ opacity: cursorOn ? 1 : 0 }}>_</span>
          </div>

          <p className="leading-relaxed max-w-md mb-8 text-[15px]" style={{ color: "var(--muted)" }}>
            Designing for the edge, building for resilience. I break things to build them better.
          </p>

          <div className="flex flex-wrap gap-4">
            <MagneticButton>
              <button
                onClick={() => { const el = document.getElementById("projects"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" }); }}
                className="px-6 py-2.5 font-sans font-semibold text-sm rounded transition-opacity hover:opacity-75"
                style={{ background: "var(--accent)", color: "var(--bg)", border: "none", cursor: "pointer" }}
              >
                Projects
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={() => { const el = document.getElementById("contact"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" }); }}
                className="px-6 py-2.5 font-sans font-semibold text-sm rounded"
                style={{ border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent", cursor: "pointer" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--accent)"; el.style.color = "var(--bg)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "transparent"; el.style.color = "var(--accent)"; }}
              >
                Contact
              </button>
            </MagneticButton>
          </div>
        </div>

        {/* ── Right ────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-[280px] flex justify-center reveal-right">
          {/* Container — explicit size creates reliable stacking context for layers */}
          <div className="relative" style={{ width: "min(420px, 100%)", height: "min(420px, 100vw)", isolation: "isolate" }}>

            {/* Layer 0 — 3D hand (desktop only, behind everything) */}
            {showHand && mounted && <HandGlobe />}

            {/* Layer 1 — 2D globe canvas */}
            <div style={{ position: "relative", zIndex: 1 }}>
              <GlobeCanvas nodes={nodes} onHoverChange={handleHoverChange} />
            </div>

            {/* Layer 2 — Glass terminal */}
            <div
              className="absolute bottom-2 right-0 w-56 rounded-lg overflow-hidden"
              style={{
                zIndex: 2,
                background: "var(--bg-card)", backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)", border: "1px solid var(--muted)",
              }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: "var(--muted)" }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: "var(--accent)" }} />
                <span className="font-mono font-semibold tracking-widest" style={{ fontSize: 9, color: "var(--accent)" }}>
                  CLOUD TELEMETRY
                </span>
              </div>
              <div ref={logContainerRef} className="h-32 overflow-y-auto p-2 space-y-1 scrollbar-hide">
                {mounted ? logs.map((line, i) => (
                  <p key={i} className="font-mono leading-snug" style={{ fontSize: 9, color: "var(--muted)" }}>
                    {line}
                  </p>
                )) : (
                  <p className="font-mono leading-snug" style={{ fontSize: 9, color: "var(--muted)" }}>
                    Initializing...
                  </p>
                )}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
