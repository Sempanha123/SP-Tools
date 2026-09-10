# SP-Tools V39 — Global Sticky Context Header + Mobile Menu Fix

V39 changes the context header architecture instead of trying to keep the old
DownloadStudio-local sticky rail alive.

## Why the downloader rail moved away at "How it works"

The old rail lived **inside `DownloadStudio.vue`**.

`DownloadSteps` / "How it works" is rendered **after** `DownloadStudio`, so even
a correct `position: sticky` element is constrained by the bottom of its own
parent. When the page reached "How it works", that sticky element had to leave.

V39 moves the context rail to:

```text
layouts/default.vue
```

directly after:

```text
<SiteHeader />
```

That means its sticky containing block is the whole site layout, not just the
download studio.

Now it stays available through:

```text
download workspace
How it works
FAQ
related tools
```

until the user leaves that tool page.

## Downloader context

Examples:

```text
Interactive downloader
TikTok download studio

Interactive downloader
Facebook media studio

Interactive downloader
YouTube stream studio
```

## AI context

V39 adds the same system for AI pages:

```text
AI image workspace
Background remover studio

AI image workspace
Image upscaler studio
```

It reads the existing tool catalogue from `useTools()` instead of duplicating
the entire tool configuration.

## Mobile menu fix

The V36 smart header uses `pointer-events: none` on the outer floating shell so
the hidden header does not block page interaction.

The desktop floating panel re-enabled pointer events, but the mobile dropdown
lives outside that panel. That is why the menu could open visually but its
items could not be clicked.

V39 gives the mobile menu its own:

```text
pointer-events: auto
z-index above the context rail
```

On mobile it is also positioned as a fixed dropdown below the global header.

## Z-index order

```text
mobile/global SiteHeader menu   70+
global SiteHeader               70
context rail                    28-32
page content                    normal
```

So the context rail cannot block the mobile navigation.

## Apply

V36/V38 should already be installed.

```powershell
Ctrl + C

Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V39.ps1
```

Then restart:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh:

```text
Ctrl + Shift + R
```

Test:

```text
/download/tiktok-download
/download/facebook-video-download
/download/youtube-download
/tools/bg-remover
/tools/image-upscaler
```

For downloader pages, scroll all the way into "How it works" and FAQ. The
context rail should remain sticky.

On mobile, open AI Tools / Downloaders and click menu entries.

## Verify

```powershell
.\VERIFY_V39.ps1
```

The installer makes a timestamped backup of the layout, Header.vue,
DownloadStudio.vue and main.css before changing them.
