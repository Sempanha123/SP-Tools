$ErrorActionPreference = "Stop"

$CandidateRoots = @((Get-Location).Path, (Split-Path -Parent $MyInvocation.MyCommand.Path)) | Select-Object -Unique
$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if (Test-Path (Join-Path $candidate "SPTools\package.json")) { $RepoRoot = $candidate; break }
}
if (-not $RepoRoot) { throw "Could not find SPTools\package.json." }

$CssPath = Join-Path $RepoRoot "SPTools\assets\css\main.css"
if (-not (Select-String -Path $CssPath -Pattern "Prism Aurora V4" -Quiet)) {
    throw "V4 marker not found. Apply APPLY_REDESIGN.ps1 first."
}

Write-Host "V4 marker found." -ForegroundColor Green

$Backend = Join-Path $RepoRoot "backend"
if ((Test-Path (Join-Path $Backend "artisan")) -and (Get-Command php -ErrorAction SilentlyContinue)) {
    Push-Location $Backend
    try {
        Write-Host "Checking Laravel API routes..." -ForegroundColor Yellow
        & php artisan config:clear
        & php artisan route:list --path=api/v1
        if ($LASTEXITCODE -ne 0) { throw "Laravel API route check failed." }
    } finally { Pop-Location }
}

Push-Location (Join-Path $RepoRoot "SPTools")
try {
    Write-Host "Running Nuxt production build..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw "Nuxt build failed." }
} finally { Pop-Location }

Write-Host "V4 verification passed." -ForegroundColor Green
