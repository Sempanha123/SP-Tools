# SP-Tools V41 — Real Brand Logo + Competitive Free SEO

V41 combines the approved SP-Tools branding direction with a broader,
high-intent SEO pass for the five main utility pages.

## Production logo integration

Installed brand assets:

```text
/public/favicon.svg
/public/favicon-32x32.png
/public/apple-touch-icon.png
/public/site.webmanifest

/public/brand/sp-tools-mark.svg
/public/brand/sp-tools-mark-192.png
/public/brand/sp-tools-mark-512.png
/public/brand/sp-tools-logo.svg
/public/brand/sp-tools-og.png
```

The old generic lightning placeholder in the global Header and Footer is
replaced with one reusable component:

```text
components/site/BrandLogo.vue
```

The word "SP-Tools" remains semantic HTML next to the SVG mark, which is better
for accessibility and avoids turning the entire brand name into image-only text.

## Brand SEO

`SiteBrandSeo` adds:

```text
Organization JSON-LD
WebSite JSON-LD
brand logo ImageObject
default Open Graph image
default Twitter image
```

The five V40 tool pages also receive a `WebApplication` entity with a free
Offer (`price: 0`) in addition to the existing WebPage and BreadcrumbList data.

## More competitive "free" intent

The keyword/content expansion is based on current search-result patterns around
free online tools. High-ranking pages repeatedly make a few useful promises
clear near the top:

```text
free online
no signup
no watermark when true
supported formats
2x / 4x
transparent PNG
public links
HD when available
mobile/browser access
```

V41 uses those ideas only where SP-Tools can actually support the claim.

Examples added naturally to the page copy and keyword clusters:

```text
100% free background remover
free background remover no signup
remove background free online

100% free image upscaler
free image upscaler no signup
upscale image free online

free TikTok downloader online
TikTok downloader free no signup
free TikTok MP4 downloader

free Facebook downloader online
Facebook Reels downloader free
free FB video downloader

free YouTube downloader online
YouTube downloader free no signup
free YouTube audio downloader
free YouTube MP4 downloader
```

There is also a new visible "Free online utility" section on each page rather
than hiding keyword text from users.

## Why the patch does not repeat "free" dozens of times

Search engines can treat unnatural repetition as keyword stuffing.

V41 puts the phrase in useful locations:

```text
SEO title
meta description
main page content
quick-answer copy
free-value section
FAQ/Q&A
related internal links
WebApplication Offer
```

and then uses topic variations rather than copying the exact same phrase over
and over.

## Search infrastructure

V41 also adds a dynamic:

```text
/robots.txt
```

that uses the current request origin and points crawlers to:

```text
/sitemap.xml
```

This avoids hardcoding a development domain into robots.txt.

## Apply

From the SP-Tools repository root:

```powershell
Ctrl + C

Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V41.ps1
```

Restart:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh:

```text
Ctrl + Shift + R
```

Check the Header/Footer logo, browser tab favicon, and all five utility pages.

## Verify

```powershell
.\VERIFY_V41.ps1
```

The installer makes a timestamped backup before modifying existing files.

After production deployment:

1. open `/robots.txt`
2. open `/sitemap.xml`
3. check page source for canonical and JSON-LD
4. submit the sitemap in Google Search Console
5. request re-indexing for the five updated tool URLs

SEO rankings cannot be guaranteed; the goal is to improve relevance,
crawlability, branding, internal linking, and useful search-intent coverage.
