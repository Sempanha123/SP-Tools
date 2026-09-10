# SP-Tools V21 — Image-First Coverage Explorer

V21 implements the image-led category design.

## Why V21 is different

The category cards no longer depend only on icons, gradients and descriptions.

Every active desk attempts to show:

- latest article image
- category name
- category description
- article count
- latest headline
- latest timestamp
- clear arrow / click affordance

## How images are resolved

1. V21 first looks inside the existing `latestArticles` homepage feed.
2. If that category is missing from the homepage feed but has published articles, V21 calls:

   `/categories/{slug}/news?sort=latest&per_page=1`

3. If the latest article still has no image, V21 uses a category-specific visual fallback.

This means Business, Technology, Science, Climate, Health, etc. can still have their own image even when the first 24 homepage stories do not include every category.

## Layout

Desktop:

- Large featured World card
- Asia + Americas
- Europe + Middle East
- Business + Technology + Science
- Climate + Health

Tablet:

- 2-column image grid

Mobile:

- horizontal snap cards so images stay large enough to be visually useful

## Apply

Extract into your SP-Tools repository root:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V21.ps1
```

Then restart:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh:

`Ctrl + Shift + R`

Optional:

```powershell
.\VERIFY_V21.ps1
```

The installer backs up the existing `Topics.vue` and `main.css` automatically.
