# SP-Tools V8 — Current GitHub compatibility repair

This is NOT another visual redesign. It repairs the mismatch between the old V7 pack and the repository as it exists now.

## What changed in GitHub

The project root is now `frontend/` + `backend/`, not `SPTools/` + `backend/`.

The latest cleanup commit also removed a set of live Nuxt routes/components. This pack restores only files that are currently missing, using commit:

`a82051976bd8650bf5e59b4124774fed700d09b9`

Existing files are not overwritten by the recovery step.

## Important CSS issue

The current V7 stylesheet exists at `frontend/css/main.css`, but Nuxt imports `~/assets/css/main.css`, i.e. `frontend/assets/css/main.css`.

The downloader Vue files and `DownloadStudio` already match V7, but the stylesheet actually used by Nuxt is an older file. That is why the page can still look incomplete or partly like the older version.

This repair copies the full V7 stylesheet into the live `frontend/assets/css/main.css` path.

## Apply

Stop Nuxt first, then from the repository root:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_CURRENT_GITHUB_FIX.ps1
```

Then verify:

```powershell
.\VERIFY_CURRENT_GITHUB.ps1
```

Or start dev:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with `Ctrl+Shift+R`.
