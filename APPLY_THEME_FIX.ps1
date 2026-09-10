$ErrorActionPreference = "Stop"

$PackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$CandidateRoots = @(
    (Get-Location).Path,
    $PackRoot,
    (Split-Path -Parent $PackRoot)
) | Select-Object -Unique

$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if (Test-Path (Join-Path $candidate "frontend\package.json")) {
        $RepoRoot = $candidate
        break
    }
}

if (-not $RepoRoot) {
    throw "Could not find repo root. Run this from the folder that contains frontend\package.json."
}

$CssPath = Join-Path $RepoRoot "frontend\assets\css\main.css"
$StudioPath = Join-Path $RepoRoot "frontend\components\download\Studio.vue"

if (-not (Test-Path $CssPath)) { throw "Missing: $CssPath" }
if (-not (Test-Path $StudioPath)) { throw "Missing: $StudioPath" }

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $RepoRoot ".ui-theme-v9-backup-$Timestamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$BackupCss = Join-Path $BackupRoot "frontend\assets\css\main.css"
$BackupStudio = Join-Path $BackupRoot "frontend\components\download\Studio.vue"
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $BackupCss) | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Parent $BackupStudio) | Out-Null
Copy-Item $CssPath $BackupCss
Copy-Item $StudioPath $BackupStudio

Write-Host ""
Write-Host "SP-Tools V9 — Downloader Theme Parity Fix" -ForegroundColor Cyan
Write-Host "Repository: $RepoRoot"
Write-Host "Backup:     $BackupRoot"
Write-Host ""

# ---------------------------------------------------------------------------
# 1) Make DownloadStudio semantic instead of hardcoded white-on-dark.
# ---------------------------------------------------------------------------
$studio = Get-Content -Raw $StudioPath

$replacements = [ordered]@{
    'text-white/92' = 'text-fg'
    'text-white/75' = 'text-fg-muted'
    'text-white/62' = 'text-fg-muted'
    'text-white/58' = 'text-fg-muted'
    'text-white/52' = 'text-fg-muted'
    'text-white/48' = 'text-fg-muted'
    'text-white/45' = 'text-fg-muted'
    'text-white/42' = 'text-fg-muted'
    'text-white/38' = 'text-fg-subtle'
    'text-white/35' = 'text-fg-subtle'
    'text-white/34' = 'text-fg-subtle'
    'border-white/[.10]' = 'border-line'
    'border-white/[.09]' = 'border-line'
    'border-white/[.08]' = 'border-line'
    'border-white/[.07]' = 'border-line'
    'border-white/10' = 'border-line'
    'bg-white/[.055]' = 'bg-surface-3'
    'bg-white/[.04]' = 'bg-surface-3/80'
    'bg-white/[.035]' = 'bg-surface-3/80'
    'bg-white/[.028]' = 'bg-surface-3/70'
    'bg-white/[.018]' = 'bg-surface-2/70'
    'bg-white/[.014]' = 'bg-surface-2/60'
    'bg-white/[.06]' = 'bg-surface-3'
    'bg-white/[.1]' = 'bg-surface-3'
    'bg-white/8' = 'bg-surface-3'
    'bg-black/10' = 'bg-surface-2/55'
    'hover:bg-white/[.1]' = 'hover:bg-surface-3'
    'hover:text-white' = 'hover:text-fg'
}
foreach ($pair in $replacements.GetEnumerator()) {
    $studio = $studio.Replace($pair.Key, $pair.Value)
}

# Replace only standalone "text-white", not text-white/xx.
$studio = [regex]::Replace($studio, '(?<![\w-])text-white(?!/)', 'text-fg')

Set-Content -Path $StudioPath -Value $studio -Encoding UTF8
Write-Host "updated  frontend\components\download\Studio.vue" -ForegroundColor Green

# ---------------------------------------------------------------------------
# 2) Append the final theme-aware downloader CSS.
# ---------------------------------------------------------------------------
$marker = "SP-Tools V9 — Downloader light/dark theme parity"

$css = Get-Content -Raw $CssPath

if ($css.Contains($marker)) {
    Write-Host "skip     V9 CSS already present" -ForegroundColor Yellow
}
else {
    $patch = @'

/* ==========================================================================
   SP-Tools V9 — Downloader light/dark theme parity
   Fixes V7's forced-dark downloader canvas. Light mode is now genuinely
   light, while dark mode keeps the cinematic studio treatment.
   ========================================================================== */

/* LIGHT MODE: semantic downloader canvas */
.sp-download-page {
  color-scheme: light !important;

  --sp-page: #f5f7fb;
  --sp-surface: #ffffff;
  --sp-surface-soft: #eef2f7;
  --sp-surface-raised: #ffffff;
  --sp-ink-soft: #141821;

  --sp-text: #10141c;
  --sp-text-secondary: #4e596a;
  --sp-text-muted: #7b8697;

  --sp-border: rgb(15 23 42 / .10);
  --sp-border-strong: rgb(15 23 42 / .17);

  --sp-positive: #148461;
  --sp-positive-soft: rgb(20 132 97 / .09);
  --sp-danger: #d63c52;
  --sp-danger-soft: rgb(214 60 82 / .08);
  --sp-shadow-rgb: 15 23 42;

  background:
    radial-gradient(circle at 78% 6%, color-mix(in srgb, var(--sp-platform-a) 8%, transparent), transparent 30rem),
    radial-gradient(circle at 8% 38%, color-mix(in srgb, var(--sp-platform-b) 5%, transparent), transparent 34rem),
    linear-gradient(180deg, #fbfcff 0%, #f4f7fb 46%, #f8faff 100%) !important;
  color: var(--sp-text) !important;
}

.sp-download-console-page {
  border-bottom-color: var(--sp-border) !important;
  background:
    radial-gradient(circle at 76% 2%, color-mix(in srgb, var(--sp-platform-a) 10%, transparent), transparent 31%),
    radial-gradient(circle at 12% 50%, color-mix(in srgb, var(--sp-platform-b) 6%, transparent), transparent 36%),
    linear-gradient(180deg, #fbfcff 0%, #f5f7fb 100%) !important;
  color: var(--sp-text) !important;
}

.sp-download-page > section:not(.sp-download-console-page) {
  background-color: transparent !important;
  background-image:
    linear-gradient(180deg, rgb(255 255 255 / .36), transparent 34%),
    radial-gradient(circle at 86% 0%, color-mix(in srgb, var(--sp-platform-a) 4%, transparent), transparent 24rem) !important;
  border-color: var(--sp-border) !important;
}

.sp-download-page > section:not(.sp-download-console-page):nth-of-type(even) {
  background-color: rgb(255 255 255 / .38) !important;
}

.sp-download-page .sp-lens-card,
.sp-download-page .sp-card,
.sp-download-page dl,
.sp-download-page .sp-workspace-pane {
  background: color-mix(in srgb, var(--sp-surface-raised) 92%, transparent) !important;
  border-color: var(--sp-border) !important;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .75),
    0 18px 55px rgb(var(--sp-shadow-rgb) / .07) !important;
}

.sp-download-page .sp-lens-card:hover,
.sp-download-page .sp-format-row:hover {
  border-color: color-mix(in srgb, var(--sp-platform-a) 28%, var(--sp-border)) !important;
  background: color-mix(in srgb, var(--sp-platform-a) 3.5%, var(--sp-surface-raised)) !important;
}

.sp-download-page .sp-download-console-chip {
  border-color: var(--sp-border);
  background: color-mix(in srgb, var(--sp-surface-raised) 88%, transparent);
  color: var(--sp-text-secondary);
  box-shadow: 0 5px 18px rgb(var(--sp-shadow-rgb) / .04);
}

.sp-download-page .sp-download-stage-step {
  border-color: var(--sp-border);
  background: color-mix(in srgb, var(--sp-surface-raised) 90%, transparent);
  color: var(--sp-text-muted);
}
.sp-download-page .sp-download-stage-step strong {
  color: var(--sp-text-secondary);
}

.sp-download-page .sp-download-start {
  background: color-mix(in srgb, var(--sp-surface-raised) 86%, transparent) !important;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .8),
    0 16px 46px rgb(var(--sp-shadow-rgb) / .055);
}

.sp-download-page .sp-download-state {
  color: var(--sp-text);
}

.sp-download-page .sp-download-state[class*="border-y"] {
  border-color: var(--sp-border) !important;
}

.sp-download-page .sp-platform-step {
  background: var(--sp-surface-raised);
}

.sp-download-page .sp-format-row,
.sp-download-page .sp-platform-media-card {
  background: color-mix(in srgb, var(--sp-surface-raised) 92%, transparent) !important;
  border-color: var(--sp-border) !important;
}

/* Header follows theme too; V7 previously forced it dark on every downloader. */
.sp-header-download {
  color-scheme: light !important;

  --sp-page: #f5f7fb;
  --sp-surface: #ffffff;
  --sp-surface-soft: #eef2f7;
  --sp-surface-raised: #ffffff;
  --sp-text: #10141c;
  --sp-text-secondary: #4e596a;
  --sp-text-muted: #7b8697;
  --sp-border: rgb(15 23 42 / .10);
  --sp-border-strong: rgb(15 23 42 / .17);
  --sp-accent-soft: rgb(101 87 245 / .09);
  --sp-shadow-rgb: 15 23 42;

  border-color: var(--sp-border) !important;
  background: rgb(250 251 254 / .90) !important;
  box-shadow: 0 10px 32px rgb(15 23 42 / .07) !important;
}

.sp-header-download .sp-header-link,
.sp-header-download .sp-brand-name,
.sp-header-download .sp-header-link-active,
.sp-header-download .sp-header-icon {
  color: var(--sp-text) !important;
}

/* DARK MODE: preserve the full cinematic studio, but with explicit readable
   semantic tokens for Steps / FAQ / Related Tools too. */
.dark .sp-download-page {
  color-scheme: dark !important;

  --sp-page: #070b12;
  --sp-surface: #0b111a;
  --sp-surface-soft: #111925;
  --sp-surface-raised: #0f1722;
  --sp-ink-soft: #f2f5fa;

  --sp-text: #f3f6fb;
  --sp-text-secondary: #aab4c4;
  --sp-text-muted: #758196;

  --sp-border: rgb(255 255 255 / .078);
  --sp-border-strong: rgb(255 255 255 / .15);

  --sp-positive: #66d9ae;
  --sp-positive-soft: rgb(102 217 174 / .1);
  --sp-danger: #ff7c8d;
  --sp-danger-soft: rgb(255 124 141 / .1);
  --sp-shadow-rgb: 0 0 0;

  background:
    radial-gradient(circle at 76% 2%, color-mix(in srgb, var(--sp-platform-a) 9%, transparent), transparent 28rem),
    radial-gradient(circle at 8% 34%, color-mix(in srgb, var(--sp-platform-b) 6%, transparent), transparent 34rem),
    linear-gradient(180deg, #070b12 0%, #080d15 42%, #070b12 100%) !important;
  color: var(--sp-text) !important;
}

.dark .sp-download-console-page {
  border-bottom-color: rgb(255 255 255 / .075) !important;
  background:
    radial-gradient(circle at 74% 0%, color-mix(in srgb, var(--sp-platform-a) 16%, transparent), transparent 31%),
    radial-gradient(circle at 13% 52%, color-mix(in srgb, var(--sp-platform-b) 9%, transparent), transparent 36%),
    linear-gradient(180deg, #080d15 0%, #070b12 100%) !important;
  color: var(--sp-text) !important;
}

.dark .sp-download-page > section:not(.sp-download-console-page) {
  background-color: transparent !important;
  background-image:
    linear-gradient(180deg, rgb(255 255 255 / .008), transparent 32%),
    radial-gradient(circle at 85% 0%, color-mix(in srgb, var(--sp-platform-a) 3.5%, transparent), transparent 22rem) !important;
  border-color: rgb(255 255 255 / .07) !important;
}

.dark .sp-download-page > section:not(.sp-download-console-page):nth-of-type(even) {
  background-color: rgb(255 255 255 / .012) !important;
}

.dark .sp-download-page .sp-lens-card,
.dark .sp-download-page .sp-card,
.dark .sp-download-page dl,
.dark .sp-download-page .sp-workspace-pane {
  background: rgb(255 255 255 / .028) !important;
  border-color: rgb(255 255 255 / .08) !important;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .03),
    0 24px 80px rgb(0 0 0 / .14) !important;
}

.dark .sp-download-page .sp-download-console-chip {
  border-color: rgb(255 255 255 / .09);
  background: rgb(255 255 255 / .04);
  color: rgb(255 255 255 / .58);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .025);
}

.dark .sp-download-page .sp-download-stage-step {
  border-color: rgb(255 255 255 / .075);
  background: rgb(255 255 255 / .025);
  color: rgb(255 255 255 / .36);
}
.dark .sp-download-page .sp-download-stage-step strong {
  color: rgb(255 255 255 / .62);
}

.dark .sp-download-page .sp-download-start {
  background: rgb(255 255 255 / .028) !important;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .035),
    0 18px 50px rgb(0 0 0 / .12);
}

.dark .sp-download-page .sp-format-row,
.dark .sp-download-page .sp-platform-media-card {
  background: rgb(255 255 255 / .032) !important;
  border-color: rgb(255 255 255 / .08) !important;
}

.dark .sp-header-download {
  color-scheme: dark !important;

  --sp-page: #070b12;
  --sp-surface: #080d15;
  --sp-surface-soft: #101823;
  --sp-surface-raised: #0d1520;
  --sp-text: #f3f6fb;
  --sp-text-secondary: #aab4c4;
  --sp-text-muted: #758196;
  --sp-border: rgb(255 255 255 / .078);
  --sp-border-strong: rgb(255 255 255 / .15);
  --sp-accent-soft: rgb(101 87 245 / .14);
  --sp-shadow-rgb: 0 0 0;

  border-color: rgb(255 255 255 / .075) !important;
  background: rgb(7 11 18 / .91) !important;
  box-shadow: 0 15px 42px rgb(0 0 0 / .18) !important;
}

@media (max-width: 767px) {
  .sp-download-page > section:not(.sp-download-console-page) {
    background-image: none !important;
  }
}
'@

    Add-Content -Path $CssPath -Value $patch -Encoding UTF8
    Write-Host "updated  frontend\assets\css\main.css" -ForegroundColor Green
}

# ---------------------------------------------------------------------------
# 3) Clear Nuxt generated files so the changed CSS definitely recompiles.
# ---------------------------------------------------------------------------
$NuxtDir = Join-Path $RepoRoot "frontend\.nuxt"
if (Test-Path $NuxtDir) {
    try {
        Remove-Item -Recurse -Force $NuxtDir
        Write-Host "cleared  frontend\.nuxt" -ForegroundColor Yellow
    }
    catch {
        Write-Host "warning  Could not clear frontend\.nuxt. Stop npm run dev and delete it manually." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Theme parity fix applied." -ForegroundColor Green
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  cd frontend"
Write-Host "  npm run dev -- --port 3001"
Write-Host ""
Write-Host "Then test BOTH theme states and hard-refresh with Ctrl+Shift+R."
