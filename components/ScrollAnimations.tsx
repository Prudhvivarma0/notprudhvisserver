"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollAnimations() {
  useEffect(() => {
    // ── .reveal — fade up ─────────────────────────────────────────────────
    gsap.utils.toArray<Element>(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ── .reveal-left ──────────────────────────────────────────────────────
    gsap.utils.toArray<Element>(".reveal-left").forEach((el) => {
      gsap.from(el, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ── .reveal-right ─────────────────────────────────────────────────────
    gsap.utils.toArray<Element>(".reveal-right").forEach((el) => {
      gsap.from(el, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ── .reveal-stagger — grouped by parent ───────────────────────────────
    const groups = new Map<Element, Element[]>();
    gsap.utils.toArray<Element>(".reveal-stagger").forEach((el) => {
      const parent = el.parentElement ?? document.body;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent)!.push(el);
    });

    groups.forEach((children) => {
      children.forEach((el, i) => {
        gsap.from(el, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: children[0], start: "top 90%" },
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
