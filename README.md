# notprudhvisserver

Personal portfolio — Prudhvi Varma. Built with Claude. Deployed on Cloudflare.

---

## How this was built

This entire portfolio was designed and built in collaboration with [Claude](https://claude.ai) (Anthropic's AI). No Figma. No design agency. No template. The process went roughly like this:

1. **Design handoff** — A detailed natural-language design brief was written describing the visual direction: monochrome palette, editorial typography, viscous variable-font letters, magnetic buttons, wipe transitions, canvas globe, and project row invert-hover. Claude interpreted that brief and produced a complete component system.

2. **Component build** — Claude wrote every React component from scratch: the sticky nav with animated underline indicator, the hero with live canvas globe, the viscous letter mousemove effect using `font-variation-settings`, the magnetic button physics, the two-panel page wipe transition, and all the section layouts.

3. **Content** — LinkedIn and GitHub were scraped by Claude to populate projects, certifications, and experience. All copy was written or refined in conversation.

4. **Iteration** — Design tweaks, mobile responsiveness, copy changes, and bug fixes were all done through conversation. No manual CSS was written by hand.

5. **Deployment** — Cloudflare Pages via `@cloudflare/next-on-pages`. Connected to GitHub, auto-deploys on push.

The confession at the bottom of the page is real.

---

## Stack

```json
{
  "framework":    "Next.js 15 (App Router)",
  "runtime":      "Cloudflare Pages (edge)",
  "database":     "Cloudflare D1 (SQLite at the edge)",
  "styling":      "CSS custom properties + inline styles",
  "fonts":        ["Anton", "Inter Tight (variable)", "JetBrains Mono", "Instrument Serif"],
  "animations":   "Vanilla CSS transitions + Web Animations API",
  "canvas":       "Canvas 2D API — no Three.js",
  "language":     "TypeScript",
  "deployment":   "@cloudflare/next-on-pages"
}
```

---

## Interactions

| Feature | How it works |
|---|---|
| **Viscous letters** | `mousemove` → distance from cursor → `font-variation-settings: "wght"` on Inter Tight variable font |
| **Magnetic buttons** | `mousemove` → `translate(dx * 0.4, dy * 0.4)` on element, resets on leave |
| **Page wipe** | Two `position: fixed` panels animate `translateY` sequentially on nav click |
| **Canvas globe** | Custom 2D projection math — latitude ellipses, rotating longitude lines, great-circle beam arcs, land dots |
| **Animated nav underline** | DOM `getBoundingClientRect()` on active item → `left` + `width` CSS transitions |
| **Scrollspy** | `window.scrollY + 200` vs section `offsetTop` on passive scroll listener |
| **Theme toggle** | `data-theme` attribute on `<html>` + CSS custom property overrides + `localStorage` |
| **Reduced motion** | `prefers-reduced-motion` media query disables viscosity, magnetic, wipe, and globe rotation |

---

## Architecture

```
app/
├── layout.tsx          # Fonts, theme init from localStorage, scroll reset
├── page.tsx            # Renders V3Page
└── globals.css         # Design tokens, typography helpers, interaction classes

components/v3/
├── V3Page.tsx          # Root — holds all state (dark, activeNav, wiping)
├── TopNav.tsx          # Sticky nav + animated underline + theme toggle
├── Hero.tsx            # Viscous headline + canvas globe + magnetic CTAs
├── DisciplinesGrid.tsx # 4×2 discipline band
├── About.tsx           # Portrait + bio copy
├── WorkList.tsx        # Project rows with invert-hover
├── TimelineGrid.tsx    # Experience entries
├── CertsAchievements.tsx # Certs + CTF achievements
├── Contact.tsx         # SAY HELLO + contact links + footer
├── WipeOverlay.tsx     # Two-panel page transition
├── LiveGlobe.tsx       # Canvas 2D globe
├── Flex.tsx            # Variable-font letter wrapper
└── Magnetic.tsx        # Magnetic button physics
```

---

## Local dev

```bash
npm install
npm run dev
```

No environment variables needed for local dev. All content is hardcoded in components.

---

## Deploy

Connects to Cloudflare Pages via GitHub. Every push to `main` triggers a build.

```bash
git push origin main
```

Manual deploy:
```bash
npm run build
npx wrangler pages deploy .vercel/output/static
```

---

## Contact

**Email:** prudhvivarma31@gmail.com  
**LinkedIn:** [prudhvivarma11](https://www.linkedin.com/in/prudhvivarma11/)  
**GitHub:** [Prudhvivarma0](https://github.com/Prudhvivarma0)

---

*Yes, I asked an AI to design and build this. No, I'm not sorry. Neither is Claude.*
