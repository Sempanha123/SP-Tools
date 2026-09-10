# SP-Tools Premium UI Redesign Pack

This pack contains complete replacement frontend files for the SP-Tools Nuxt app.

## What it changes

- Rebuilds the color/surface/spacing design system.
- Removes the global serif heading rule.
- Reworks the Header and Footer into a compact product shell.
- Rebuilds ToolHero without the large purple/fuchsia/cyan blob composition.
- Rebuilds upload and URL input workspaces.
- Replaces the four-card "How it works" section with a connected timeline.
- Replaces separate FAQ cards with one unified accordion.
- Reworks Related Tools cards.
- Rebuilds the root homepage and `/tools` directory.
- Rebuilds the News hero, breaking ticker, category nav, featured stories,
  latest-news controls, most-read sidebar, newsletter, and shared article cards.
- Keeps the existing FastAPI/Laravel calls, route names and downloader logic untouched.

## Apply on Windows

1. Extract this ZIP into the repository root (the folder that contains `SPTools`).
2. Open PowerShell in the extracted pack folder.
3. Run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_REDESIGN.ps1
```

The script creates a timestamped backup before overwriting any file.

Then run:

```powershell
cd SPTools
Remove-Item -Recurse -Force .nuxt -ErrorAction SilentlyContinue
npm run dev -- --port 3001
```

Hard refresh the browser with `Ctrl + Shift + R`.

## Verify

Check:

- `/`
- `/tools`
- `/tools/bg-remover`
- `/tools/image-upscaler`
- `/download/tiktok-download`
- `/download/facebook-video-download`
- `/download/youtube-download`
- `/news`

Build check:

```powershell
npm run build
```

The repository currently has no `typecheck` or `lint` scripts in `SPTools/package.json`,
so do not treat those as configured checks unless you add them separately.

## Important

This pack intentionally does not modify backend/API behavior. It is a frontend
UX/UI redesign only.
