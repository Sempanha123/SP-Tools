# SP-Tools News backend/frontend audit — V5

## API contract

The Laravel route set and Nuxt `useNewsApi.ts` agree on the main public endpoints:

- `GET /api/v1/news`
- `GET /api/v1/news/search`
- `GET /api/v1/news/featured`
- `GET /api/v1/news/breaking`
- `GET /api/v1/news/most-read`
- `GET /api/v1/news/{slug}`
- `GET /api/v1/categories`
- `GET /api/v1/categories/{slug}/news`
- `GET /api/v1/tags`
- `GET /api/v1/tags/{slug}/news`
- `GET /api/v1/authors/{slug}/news`

## Integration fixes included from V4/V5 pack

- CORS permits the local Nuxt dev origin on `127.0.0.1:3001` / `localhost:3001` as well as the prior 3000 origin.
- Article author links use the stored user slug rather than blindly slugifying the display name.
- `/storage/...` cover/section images are returned with the Laravel origin so the Nuxt browser does not accidentally request them from port 3001.

## Why the News screenshots were empty

The screenshot showed the frontend reporting a failed request to `127.0.0.1:8000`. A UI redesign cannot supply real article data if Laravel is not reachable. Make sure the backend is running:

```powershell
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Then check:

```text
http://127.0.0.1:8000/api/v1/health
http://127.0.0.1:8000/api/v1/news
```

## Demo newsroom

V5 adds 24 fictional, clearly identified development fixtures through `DemoNewsSeeder`. They are designed to populate:

- News home lead/secondary stories
- Breaking ticker
- Most Read
- Category archives
- Search
- Tag pages
- Author pages
- Article detail sections/timeline/source modules

For an existing local database:

```powershell
.\SEED_DEMO_NEWS.ps1
```

For a brand-new local database (destructive):

```powershell
.\SEED_DEMO_NEWS.ps1 -Fresh
```
