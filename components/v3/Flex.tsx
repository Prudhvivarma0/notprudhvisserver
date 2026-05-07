"use client";

export function Flex({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={i}
          className="v3-flex-letter"
          style={{ fontVariationSettings: '"wght" 300' }}
        >
          {c === " " ? "\u00a0" : c}
        </span>
      ))}
    </>
  );
}
