# SP-Tools V15 — News Article Polish

This is an incremental patch for the V14 result shown in the screenshot.

## Visible improvements

- Right-side reader rail grows from ~405px to **440px**.
- **More news** titles become **16.5px** and can use up to **4 lines**.
- Recommendation thumbnails become larger.
- Reading Guide is slightly more compact, so More News starts higher.
- **More from this category** heading becomes much larger.
- Category cards use much larger headlines and automatically use the full width when only 1 or 2 articles exist.
- `About this report` is visually reduced so it does not compete with the story.
- Rich-media demo now updates **Food logistics** too, not only Open-source teams.

## Apply

V14 must already be applied.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V15.ps1
.\SEED_V15_DEMOS.ps1
```

Then restart Nuxt:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with Ctrl+Shift+R.

The Food Logistics article will now contain:
- section image
- four-image gallery
- embedded YouTube demo
- second section image
