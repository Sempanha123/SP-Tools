# SP-Tools Prism Aurora V3 — High-End UI/UX Upgrade

This V3 pack is designed specifically on top of your current **`updatev2`** SP-Tools frontend.
It keeps the existing product/API behavior while pushing the interface further into a high-end product + editorial direction.

## V3 visual direction

The goal is **wow without becoming noisy**:

- asymmetric, cinematic product composition instead of basic centered landing-page sections
- deeper light/dark surfaces with restrained violet + cyan brand energy
- lens/glass panels used selectively rather than everywhere
- subtle grid/noise/aurora fields for atmosphere
- larger editorial moments mixed with compact functional UI
- bento layouts with different card sizes rather than rows of identical boxes
- dark “command center” sections to create rhythm and contrast
- stronger visual hierarchy on `/`, `/tools`, downloader flows and `/news`

## Motion upgrade

V3 adds dependency-free motion using CSS/Vue-friendly classes:

- scroll reveal and staggered cards
- animated aurora field
- moving border highlights
- subtle floating status panels
- scanline/processing effects
- animated timeline beam
- hover depth / perspective
- CTA shimmer
- image/card zoom motion
- live-signal pulses

`prefers-reduced-motion` is respected.

## Key areas upgraded

- Global design system and V3 motion primitives
- Header and navigation shell
- Root homepage
- `/tools` directory
- Shared Tool Hero
- Upload workspace
- Downloader URL command bar
- “How it works” timeline
- FAQ
- Related tools
- News hero
- Breaking ticker
- News category navigation
- Featured/top stories
- Latest-news presentation
- Most-read / trending sidebar
- Topic bento grid
- Region cards
- Newsletter
- Shared article cards
- Footer

## Apply on Windows

Extract this ZIP into the folder containing your current `SPTools` directory.
Open PowerShell there and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_REDESIGN.ps1
```

The script creates a timestamped backup of every file it replaces and clears `SPTools\.nuxt`.

Then:

```powershell
cd SPTools
npm run dev -- --port 3001
```

Open:

```text
http://127.0.0.1:3001/
```

Use `Ctrl + Shift + R` once after the server starts.

## Pages to review

```text
/
/tools
/tools/bg-remover
/tools/image-upscaler
/download/tiktok-download
/download/facebook-video-download
/download/youtube-download
/news
```

## Production build check

From the extracted pack folder you can run:

```powershell
.\VERIFY_REDESIGN.ps1
```

or from `SPTools`:

```powershell
npm run build
```

The current project does not define dedicated `lint` or `typecheck` scripts, so the Nuxt production build remains the configured verification step.

## Functionality intentionally untouched

V3 does not intentionally change FastAPI/Laravel integration, URL validation rules, clipboard behavior, download generation, image-processing requests, News composables, routes, or SEO logic.

The News API `Failed to fetch` state is a connectivity/backend issue if it still appears; the V3 UI improves how that state looks but does not fake story data.
