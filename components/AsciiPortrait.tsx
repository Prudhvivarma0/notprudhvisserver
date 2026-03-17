"use client";

import { useCallback, useRef } from "react";

// ── Portrait data ──────────────────────────────────────────────────────────

const PORTRAIT_LINES = [
  "-=-==-++-++=---=*=-*+*+=**=++-+++-++*+*=+*+##+*+++#*++***++*=-=**+-=+*",
  "---=--+--+------+=+=+++=**=+*=-=--+**+*+*+=+#+*++=#*+=***==*==-+-=--=-",
  "-----==:-=--:::---=-==+-++==*--=:-+++=+=+=-:*++===*==-++=::=-:::::::::",
  ":::::=-:--:::::------=-------::-:::-=:--=-::-+:::---:::::::...........",
  "::::--::--::::--------:--:::::----====-----::-::::::::::::::..........",
  ":-----::--:::::::::::::::-==+++++++=-:::-==-::::::.::.................",
  "::::::::::::::.........:-==-===-----:::--:---:.:::....................",
  "::::::::::::::::......:---=----::------:::::--::......................",
  "::::::::::::::::::...:=--::-::::::-:::::::::--::......................",
  "::::::::::::::::::...-+--::::---:::::::::::::::.......................",
  "::::::::::::::.:::...==-:--==***+=-::::::::::::.......................",
  "::::::::::::::.:::...--:-*#%%%%%%##***++=---:::.......................",
  "::::::::::::::::::..-=--##*+++=+**#**++===++=::.......................",
  "::::::::::::::::::.-#%*+%#*++----+#+-:::---+*-==:.....................",
  "...:.::::.::::::::.-%%**%%%#*+++*%@%*====+***=**:.....................",
  "......::::...:::::..=%%#%%%@%%%%%%@%%###%%%#++*+......................",
  ".......::::....:::...-#*#%##**##*+*+=+++**#*+*+:......................",
  ".......::::...:.::.....:+***==++===-----=+++--........................",
  "...::..::::....::::.....:=+*+*###**+++=-==--...::::::::::.............",
  ":..:::::::::...:::.......:-==*%%*++++*+--::...:====--=--=:........++++",
  ".::::==:--:..:::::.......:=::-+++=====-:.:=...:+++++++***=..:.....=+==",
  "=:.:=*===::-:.::::..::....*#+-::......::=**=::=#++==--*#*+::::::..----",
  "+::-*=++===-::::::....:-:-*%%#*+=----==+**##*+++=*###-=*#+:--:-:..::--",
  "=*=****++=--::::::...:#*:+#%%%##*+==++***####*+==++*#*++*+-----.......",
  "=**=++**++=-::::::.::=*##%%%%%###*++++****#*++====+=+***#####**+-:...:",
  "-+#=+**#++=-:::::-=+*#+=+**#####********###*+++==++++++++****#####*=::",
  ":+*=+***++=-::-=**++**+==--===-:::=*#%%%#**+--=+++++++++++++++++++***=",
  "=+*+++===+++++**++++*+++*++=-.::----+%%*+++=:.::-=++***+++++++++=++++*",
  "==---===++**+++++*+**+**++=--==+++++=+=----:-==++++*******++++=++===++",
  "======+***++++++*+**+****+++++++++++=::---==++++++*****+**++++===+===+",
  "=--==*#*+=+++=+*++********++++++++====+++++++++++++++*+++++++=========",
  "=-=+**++=+++=+*++*********++++++*===++=+++++++++++++++++++++==-----=-=",
  "-=-**++===++=++++**++****++++++++-+====-++++++++++++=++==+===--:::---=",
];

// ── Glitch chars ───────────────────────────────────────────────────────────

const GLITCH = "{}[]<>01!|/\\~";

// ── Character → style ──────────────────────────────────────────────────────

function charStyle(ch: string): { color: string; opacity: number } {
  switch (ch) {
    case ".":
      return { color: "var(--text)", opacity: 0.07 };
    case ":":
      return { color: "var(--muted)", opacity: 0.2 };
    case "-":
      return { color: "var(--muted)", opacity: 0.28 };
    case "=":
      return { color: "var(--muted)", opacity: 0.38 };
    case "+":
      return { color: "var(--accent)", opacity: 0.42 };
    case "*":
      return { color: "var(--accent)", opacity: 0.58 };
    case "#":
    case "%":
    case "@":
      return { color: "var(--accent)", opacity: 0.78 };
    default:
      return { color: "var(--muted)", opacity: 0.18 };
  }
}

// Pre-build character data so JSX doesn't recompute on every render
type CharData = { ch: string; color: string; opacity: number };
const CHAR_DATA: CharData[][] = PORTRAIT_LINES.map(line =>
  line.split("").map(ch => ({ ch, ...charStyle(ch) }))
);

// ── Component ──────────────────────────────────────────────────────────────

export function AsciiPortrait() {
  const preRef   = useRef<HTMLPreElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseEnter = useCallback(() => {
    const pre = preRef.current;
    if (!pre) return;

    clearTimeout(timerRef.current);

    const spans   = pre.querySelectorAll<HTMLSpanElement>("span");
    const total   = spans.length;
    const count   = Math.floor(total * 0.1);
    const indices = new Set<number>();

    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * total));
    }

    const originals = new Map<number, string>();
    indices.forEach(i => {
      originals.set(i, spans[i].textContent ?? "");
      spans[i].textContent = GLITCH[Math.floor(Math.random() * GLITCH.length)];
    });

    timerRef.current = setTimeout(() => {
      originals.forEach((ch, i) => { spans[i].textContent = ch; });
    }, 200);
  }, []);

  return (
    <div
      style={{ cursor: "crosshair" }}
      onMouseEnter={handleMouseEnter}
    >
      <pre
        ref={preRef}
        style={{
          margin:        0,
          fontFamily:    "var(--font-fira-code), 'Courier New', monospace",
          fontSize:      "clamp(5px, 0.85vw, 8px)",
          lineHeight:    1.15,
          letterSpacing: "-0.5px",
          whiteSpace:    "pre",
          userSelect:    "none",
        }}
        aria-hidden
      >
        {CHAR_DATA.map((row, ri) => (
          <span key={ri} style={{ display: "block" }}>
            {row.map((c, ci) => (
              <span
                key={ci}
                style={{ color: c.color, opacity: c.opacity }}
              >
                {c.ch}
              </span>
            ))}
          </span>
        ))}
      </pre>
    </div>
  );
}
