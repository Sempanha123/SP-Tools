# SP-Tools V27 — Browser AI Image Tools

V27 removes the Python/FastAPI requirement from **Background Remover** and **Image Upscaler**.

Your existing TikTok, Facebook and YouTube downloader code is intentionally left alone because those tools still use `useMediaApi()`.

## Architecture

```text
Background Remover
User browser
   ↓
Transformers.js
   ↓
onnx-community/ormbg-ONNX
   ↓
transparent PNG

Image Upscaler
User browser
   ↓
UpscalerJS
   ↓
ESRGAN Slim 2× / 4×
   ↓
upscaled image
```

There is no `/remove-bg/` or `/upscale` request from these two Nuxt pages.

## VPS impact

The expensive AI inference runs on the visitor's device.

Your VPS still serves the normal Nuxt application. It does **not** run the background-removal model or ESRGAN.

Background-removal model files are downloaded by the browser from the model host and cached by the browser. The app prefers WebGPU when it is available in a secure browser context and falls back to quantized WASM processing.

The upscaler is dynamically loaded only after the user chooses an image.

## Packages

V27 adds:

```text
@huggingface/transformers ^3.8.1
upscaler                 ^1.0.0
@upscalerjs/esrgan-slim  ^1.0.0
```

## Background model

V27 uses:

`onnx-community/ormbg-ONNX`

The model is listed with an Apache-2.0 license. V27 uses fp16 with WebGPU when possible and q8 for the fallback.

## Upscaling model

V27 uses ESRGAN Slim because it is designed to reduce latency compared with heavier ESRGAN variants. UpscalerJS and ESRGAN Slim are MIT licensed.

## Browser safety limits

Browser-side super-resolution can consume a lot of client memory, especially 4×.

V27 applies conservative limits:

- 2×: about 4.5 MP input
- 4×: about 1.5 MP input

These limits protect phones and low-memory laptops. They do not reflect VPS limits.

## Apply

Extract the ZIP into the SP-Tools repository root and run:

```powershell
Ctrl + C

Set-ExecutionPolicy -Scope Process Bypass
.\APPLY_V27.ps1
```

`APPLY_V27.ps1` will:

1. back up your current image-tool files
2. replace the two image pages
3. add `useBrowserImageAI.ts`
4. add the npm dependencies to `frontend/package.json`
5. run `npm install`
6. clear the Nuxt cache

Then:

```powershell
cd frontend
npm run dev -- --port 3001
```

Open:

```text
http://localhost:3001/tools/bg-remover
http://localhost:3001/tools/image-upscaler
```

Hard refresh with `Ctrl + Shift + R`.

## Verify

From the repository root:

```powershell
.\VERIFY_V27.ps1
```

The verifier confirms the two image pages no longer reference the old FastAPI image methods and then runs a Nuxt production build.

## Important production note

WebGPU normally requires HTTPS (localhost is also treated as a secure development context). Your production SP-Tools site should remain on HTTPS. Browsers without WebGPU can use the fallback for background removal.

## What V27 does not remove

V27 does **not** delete the Python media service because your TikTok/Facebook/YouTube downloader features may still depend on it.

Once you later migrate those downloaders too, the entire FastAPI media service can be reviewed separately.
