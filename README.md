# SP-Tools V26 — One Canonical Most Read Layout

V26 removes the different Most Read designs and makes the `/news/tag/` version the canonical design everywhere.

The reusable component is:

`frontend/components/news/shared/MostReadPanel.vue`

It is used by:

- News homepage
- `/news/category/[slug]`
- `/news/tag/[slug]`
- `/news/posts/[slug]`
- `/news/search`
- author sidebar

The canonical UI is:

- dark editorial header
- `Trending now`
- `Most read`
- large image card for #01
- 68px thumbnail rows for #02–#05
- category + time + views
- one footer button
- same radius, spacing and light/dark behavior

## Apply

From the SP-Tools repository root:

```powershell
Ctrl + C
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V26.ps1
```

Restart:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with:

`Ctrl + Shift + R`

Verify and build:

```powershell
.\VERIFY_V26.ps1
```
