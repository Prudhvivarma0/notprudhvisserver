"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollAnimations() {
  useEffect(() => {
    // ── Lenis smooth scroll ────────────────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", () => ScrollTrigger.update());

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // ── .reveal — fade up ─────────────────────────────────────────────────
    gsap.utils.toArray<Element>(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    // ── .reveal-left — slide from left ────────────────────────────────────
    gsap.utils.toArray<Element>(".reveal-left").forEach((el) => {
      gsap.from(el, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    // ── .reveal-right — slide from right ──────────────────────────────────
    gsap.utils.toArray<Element>(".reveal-right").forEach((el) => {
      gsap.from(el, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    // ── .reveal-stagger — stagger within parent group ─────────────────────
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
          scrollTrigger: {
            trigger: children[0],
            start: "top 90%",
          },
        });
      });
    });

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerFn);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
