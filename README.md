# SP-Tools V18 — Mainstream Editorial Article Redesign

This replaces the dashboard-like article page with the most common modern news/article pattern: clean headline area, large hero image, slim reader toolbar, ~760px reading column, lightweight 320px desktop sidebar, plain paragraphs, editorial quotes, inline images/gallery/YouTube, compact sources and related stories.

## Apply

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V18_EDITORIAL.ps1
```

Then restart:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with Ctrl+Shift+R. Optional build check: `.\VERIFY_V18.ps1`.
