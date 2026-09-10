# SP-Tools V17 — Header Balance + Complete Category Archives

This patch addresses two things together.

## 1. Header balance

The article reader is now wide and substantial, so V17 brings the global header up to the same scale:

- Desktop header: 80px
- Logo icon: 44px
- Brand text: 18px
- Main nav: 48px
- Larger desktop search / CTA controls
- News category sticky bar now starts below the 80px header
- Reading toolbar top offset updated to 80px

The article/body widths from V16 are intentionally kept.

## 2. Business / Tech / Science / Climate / Health

The routes themselves are valid. The backend category endpoint filters only published articles belonging to that category.

The original demo set has very few stories in these topic categories. The category page also treated `remainingArticles.length === 0` as an empty state after pulling the first article out as the lead story. That could make a working one-story category look broken.

V17 fixes both sides:

- Category page no longer claims “No stories” when a lead story exists.
- Adds a real empty state only when the category has zero published articles.
- Rebuilds the category page with a clearer hero, lead story, archive grid, most-read rail and filters.
- Fallback category navigation now includes all 10 categories, including Science, Climate and Health.
- Adds 15 new fictional demo articles:
  - 3 Business
  - 3 Technology
  - 3 Science
  - 3 Climate
  - 3 Health
- Fresh `DatabaseSeeder` runs include the expansion automatically.

## Apply

Extract this ZIP into the SP-Tools repository root:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V17.ps1
```

Populate the category archives:

```powershell
.\SEED_V17_CATEGORIES.ps1
```

Then restart Nuxt:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with `Ctrl + Shift + R`.

Optional:

```powershell
.\VERIFY_V17.ps1
```
