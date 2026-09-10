# SP-Tools Prism Aurora V5

This V5 pass is built on top of the V4 redesign pack and focuses on the two things that were still unclear in the browser:

1. The right-side downloader visual looked like a screenshot/mockup. V5 turns it into the actual interactive downloader workspace.
2. The News UI needs real demo content to expose the finished layouts, filters, category pages, author pages, tags, most-read and breaking states.

## Downloader UX change

TikTok, Facebook and YouTube now use `components/download/Studio.vue`.

The dark platform panel is no longer decorative UI. The real URL input sits under a visible `01 · Start here` label. After submit, the same panel changes to a resolver state and then to the actual thumbnail/creator/channel + returned download formats.

Platform identities stay distinct:

- TikTok: cyan + pink
- Facebook: blue
- YouTube: red

The page no longer renders a fake player above the real form, so users should immediately understand where to paste a link.

## News demo database

V5 adds `backend/database/seeders/DemoNewsSeeder.php` and wires it into `DatabaseSeeder.php`.

It creates:

- 24 fictional demo articles
- coverage across all 10 existing categories
- 4 demo authors
- featured stories
- breaking stories
- one live fixture
- view counts for Most Read
- tags, article sections, key points, timeline entries and source metadata
- unique demo cover images from Picsum

IMPORTANT: the seeded stories are synthetic UI-development fixtures, not real reporting. Their `source` and methodology fields explicitly identify them as demo content.

## Apply

Stop the Nuxt dev server first if possible.

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_REDESIGN.ps1
```

The installer creates `.ui-redesign-v5-backup-<timestamp>` before replacing existing files. It also retries locked files instead of failing immediately.

## Seed demo News without deleting the database

```powershell
.\SEED_DEMO_NEWS.ps1
```

This runs the normal `DatabaseSeeder`, which uses update-or-create behavior for the supplied fixtures.

## Build a completely fresh local News database

WARNING: this deletes the configured database tables/data and recreates them.

```powershell
.\SEED_DEMO_NEWS.ps1 -Fresh
```

Equivalent Laravel command:

```powershell
cd backend
php artisan migrate:fresh --seed
```

## Run services

News API:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```powershell
cd SPTools
npm run dev -- --port 3001
```

Keep the existing media service on port `8001` for downloader/image APIs.

Then hard refresh the browser with `Ctrl + Shift + R`.

## Verify

```powershell
.\VERIFY_REDESIGN.ps1
```

It checks the V5 marker, the new Studio component, the demo seeder PHP syntax, Laravel API routes, and runs the Nuxt production build.
