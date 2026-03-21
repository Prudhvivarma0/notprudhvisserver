# notprudhvisserver

> **WARNING:** This is v2. The old one was a single HTML file and 47 instances of `#ff8700`. This one has a database.

## WHY THIS EXISTS

Started as a bored-afternoon project, now has a CMS, a D1 database, R2 media storage, and a WebGL globe pulling live Cloudflare status data. Domain was bought on impulse. Portfolio was built to justify the domain. The scope has clearly gotten out of hand.

Is it excessive? Absolutely.

## TECH_STACK.json

```json
{
  "framework":    "Next.js 15 (App Router)",
  "runtime":      "Cloudflare Pages (edge)",
  "database":     "Cloudflare D1 (SQLite at the edge)",
  "storage":      "Cloudflare R2 (media/images)",
  "styling":      "Tailwind CSS + inline styles",
  "fonts":        ["Syne", "Fira Code", "DM Sans"],
  "animations":   "Framer Motion",
  "canvas":       "Vanilla Canvas API (globe, particles)",
  "language":     "TypeScript",
  "deployment":   "@cloudflare/next-on-pages"
}
```

## FEATURES

### The Globe
Live WebGL canvas globe in the hero section. Pulls real Cloudflare status data every 30 seconds, renders ~22 cloud nodes (AWS, GCP, Azure, Cloudflare PoPs) with actual lat/lon coordinates, connection lines, orbit rings, data stream animations, and hover tooltips. Rotates on mouse move. Zooms on scroll. No Three.js — pure Canvas 2D with manual projection math.

### Word Scroll
"I build \_\_\_" section with IntersectionObserver-driven word highlighting. Sticky heading, scrolling word list, alternating accent/text colors per word.

### ASCII Portrait
Hand-generated ASCII art that glitch-animates on hover. Pre-computed character data for performance. No images needed.

### Dark / Light Mode
Proper CSS variable theming via `next-themes`. `--accent` flips from `#00ffb4` (dark) to `#0a0a0a` (light). No flash on load.

### Responsive Navbar
Desktop: inline nav links with underline-on-hover. Mobile: full-screen overlay menu with blur backdrop, Escape key, body scroll lock.

### CMS (`/admin`)
Full headless CMS backed by D1 + R2:
- Edit every section: Hero, About, Projects, Experience, Certs, Achievements, Word Scroll, Contact, Theme, Sections
- Projects: full CRUD, icon picker (16 Lucide icons), sort order, visibility toggle
- Media library: drag-and-drop upload to R2, thumbnail grid, copy URL, delete
- Image upload on Hero (background) and About (profile image)
- Auth: Bearer token, secret stored in Cloudflare Pages secrets (never in the repo)

## ARCHITECTURE

```
app/
├── page.tsx              # Async server component — fetches from D1, passes props
├── admin/page.tsx        # Client-side CMS panel
└── api/
    ├── [table]/route.ts  # Generic D1 CRUD (edge runtime, Bearer auth)
    └── media/
        ├── route.ts      # R2 upload / list / delete
        └── [key]/route.ts# R2 public file serve

components/               # Section components (all accept optional D1 props,
│                         # fall back to hardcoded defaults in local dev)
├── Hero.tsx              # Globe + typing effect + particles
├── WordScroll.tsx        # IntersectionObserver word highlight
├── About.tsx             # Two-column: bio + ASCII portrait
├── Projects.tsx          # Bento grid, D1-driven
├── Experience.tsx        # Timeline component
├── Achievements.tsx      # Cert cards + CTF cards
├── Contact.tsx           # Magnetic buttons
└── Navbar.tsx            # Sticky hide-on-scroll + mobile overlay

lib/db.ts                 # D1 query helpers with try/catch fallbacks
migrations/
├── 0001_init.sql         # Schema (11 tables)
├── 0002_seed.sql         # Initial content
└── 0003_images.sql       # image columns, projects, media, custom_blocks
```

## LOCAL DEV

```bash
# Node.js only — no D1, components use hardcoded fallbacks
npm run dev

# Wrangler — full D1 + R2 simulation
npm run preview
```

## MIGRATIONS

```bash
# Local
npx wrangler d1 execute portfolio-db --local --file=migrations/0001_init.sql
npx wrangler d1 execute portfolio-db --local --file=migrations/0002_seed.sql
npx wrangler d1 execute portfolio-db --local --file=migrations/0003_images.sql

# Remote (production)
npx wrangler d1 execute portfolio-db --remote --file=migrations/0001_init.sql
npx wrangler d1 execute portfolio-db --remote --file=migrations/0002_seed.sql
npx wrangler d1 execute portfolio-db --remote --file=migrations/0003_images.sql
```

## SECRETS

Admin password is **never** in the repo. Set it with:

```bash
# Local: create .dev.vars (already gitignored)
echo "ADMIN_SECRET=your-password" > .dev.vars

# Production
npx wrangler pages secret put ADMIN_SECRET
```

## SECTIONS

| Section | Source | Notes |
|---|---|---|
| Hero | D1 `hero` table | typing words, CTAs |
| Word Scroll | D1 `word_scroll` | word + color_type per row |
| About | D1 `about` | paragraphs + profile_image |
| Projects | D1 `projects` | icon_name maps to Lucide |
| Experience | D1 `experience` | feeds Timeline component |
| Achievements | D1 `certifications` + `achievements` | cert cards + CTF cards |
| Contact | D1 `contact_links` | icon derived from href |

All sections fall back to hardcoded defaults when D1 returns empty or is unavailable.

## COLOR_PALETTE

```css
--accent:  #00ffb4  /* dark mode — the green */
--accent:  #0a0a0a  /* light mode — just black */
--bg:      #06080c
--text:    #e8ecf4
--muted:   rgba(200,220,255,0.4)
```

Orange is gone. Mourning period was brief.

## KNOWN_ISSUES

- R2 media uploads require the bucket to be created in the Cloudflare dashboard first
- `npm run dev` has no D1/R2 — use `npm run preview` for full local testing
- `npm run preview` builds via Vercel CLI internally (wrangler requirement), takes ~10s

## LICENSE

Do whatever. Just don't make it orange again.

## CONTACT

**Email:** prudhvivarma31@gmail.com
**Status:** Probably breaking something on purpose

---

<div align="center">

`next build && wrangler pages deploy`

</div>
