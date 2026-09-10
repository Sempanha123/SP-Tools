# SP-Tools Prism Aurora V4 — Platform + News Completion Pass

Built specifically on top of the current GitHub `main` V3 UI.

## What V4 fixes

- Finishes light/dark semantic theme cleanup for old News screens.
- Replaces the old full-purple News Search hero with the same cinematic editorial language as News Home.
- Rebuilds News Search controls, results and sidebar.
- Rebuilds News category hero/layout, author hero, tag hero and article header.
- Adds useful category fallbacks when the News API is temporarily offline, so navigation does not collapse to only “Latest”.
- Gives TikTok, Facebook and YouTube their own visual identity inside the shared downloader system.
- Gives resolved media/result cards and quality rows platform-aware styling.
- Updates browser theme-color metadata so the browser UI is not permanently violet.
- Fixes local News CORS for a frontend running on port 3001.
- Fixes absolute Laravel `/storage/...` article image URLs.
- Uses the real stored author slug in article API responses.

## Platform visual identities

- TikTok: dark creator/reel studio, cyan + pink signal, portrait preview, audio/no-watermark cues.
- Facebook: Facebook-blue media desk, public reel/video composition, HD quality stack.
- YouTube: red stream console, video-player timeline, 4K/video/audio cues.

The downloader request/download logic itself is not replaced.

## Apply on Windows

Extract this pack into the repository root—the folder that contains both `SPTools` and `backend`—then run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_REDESIGN.ps1
```

The script creates a timestamped backup first. It also adds `platform="..."` presentation props to the three existing downloader page components without changing their business logic.

### Start News API

```powershell
cd backend
php artisan config:clear
php artisan serve --host=127.0.0.1 --port=8000
```

### Start frontend

```powershell
cd SPTools
npm run dev -- --port 3001
```

### Start media API when using downloader/image tools
Run the existing FastAPI media service on port 8001 as before.

Hard refresh the browser with `Ctrl + Shift + R`.

## Pages to review

- `/`
- `/tools`
- `/tools/bg-remover`
- `/tools/image-upscaler`
- `/download/tiktok-download`
- `/download/facebook-video-download`
- `/download/youtube-download`
- `/news`
- `/news/search`
- `/news/category/world`
- any `/news/tag/...`
- any `/news/author/...`
- any `/news/posts/...`

## Verify

```powershell
.\VERIFY_REDESIGN.ps1
```

This clears Laravel config, checks API route registration when PHP/backend dependencies are available, then runs the Nuxt production build.

See `NEWS_BACKEND_AUDIT.md` for the frontend/backend compatibility audit.
