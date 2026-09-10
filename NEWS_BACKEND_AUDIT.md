# SP-Tools News Frontend ↔ Backend Audit (V4)

## Contract status
The Nuxt frontend and Laravel backend are structurally aligned:

- Frontend default API base: `http://127.0.0.1:8000/api/v1`
- Laravel routes are registered through `routes/api.php`, with the app-level `/api` prefix and route-level `/v1` prefix.
- Core routes match: news index/search/detail, featured, breaking, most-read, categories, tags and authors.
- Query filters match: `q`, `category`, `tag`, `region`, `date`, `sort`, `featured`, `breaking`, `live`, `per_page`.
- `ArticleResource` uses the camelCase fields expected by `SPTools/types/news.ts`.

## Problems found and fixed in this pack

### 1. Port 3001 CORS mismatch
The backend CORS config only explicitly allowed the original local frontend origins. V4 permits loopback development origins, including `127.0.0.1:3001`, while keeping arbitrary remote origins blocked. Production should still set `NEWS_FRONTEND_URL` to the real frontend origin.

### 2. Relative `/storage/...` article images
When an article image path was already stored as `/storage/...`, the API could return it as a relative URL. A Nuxt frontend on a different port/domain would then request that path from the frontend host. V4 makes those URLs absolute using the Laravel request/app origin.

### 3. Author slug consistency
The article resource previously derived an author slug from the author name. The author API resolves users by the actual `users.slug` column. V4 returns the real stored author slug when available, falling back to a generated slug only when necessary.

## Local run order

Backend:
```powershell
cd backend
php artisan config:clear
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend:
```powershell
cd SPTools
npm run dev -- --port 3001
```

Media service for image/download tools remains on port 8001.
