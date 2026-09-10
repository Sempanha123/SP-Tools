# SP-Tools V35 — YouTube Stay-On-Site Download

V34 fixed the YouTube resolver: video formats now appear.

The remaining problem in local development was the download manager / socket error when clicking a row such as:

```text
http://localhost:3001/api/youtube-download/file?...
```

V35 changes the browser behavior.

## New flow

```text
Click Video or Audio
→ page uses fetch() to call the Nuxt file endpoint
→ Nuxt streams the selected YouTube media
→ browser receives the result as a Blob
→ a temporary blob: URL is created
→ browser save begins
→ SP-Tools stays open
```

The page no longer navigates to the localhost media endpoint.

This is the same strategy used to stabilize the Facebook download flow.

## Why this helps

Desktop download managers often intercept navigations to downloadable URLs, including localhost URLs, and may start segmented/range requests.

V35 keeps the API call inside JavaScript `fetch()` and saves from a `blob:` URL instead.

## Memory / size limit

The selected media file is temporarily held as a browser Blob before saving.

For safety, the V35 YouTube file route caps a reported stream at about 220 MB.

There is still no FFmpeg, transcoding, or audio/video merge.

## Apply

```powershell
Ctrl + C

Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V35.ps1
```

Then:

```powershell
cd frontend
npm run dev -- --port 3001
```

Hard refresh with `Ctrl + Shift + R`.

## Verify

```powershell
.\VERIFY_V35.ps1
```

Only save content you own or have permission to use.
