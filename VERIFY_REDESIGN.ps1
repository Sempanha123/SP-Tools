$ErrorActionPreference = "Stop"

$CandidateRoots = @((Get-Location).Path, (Split-Path -Parent $MyInvocation.MyCommand.Path)) | Select-Object -Unique
$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if ((Test-Path (Join-Path $candidate "SPTools\package.json")) -and (Test-Path (Join-Path $candidate "backend\artisan"))) { $RepoRoot = $candidate; break }
}
if (-not $RepoRoot) { throw "Could not find the SP-Tools repository root." }

$CssPath = Join-Path $RepoRoot "SPTools\assets\css\main.css"
$StudioPath = Join-Path $RepoRoot "SPTools\components\download\Studio.vue"
$SeederPath = Join-Path $RepoRoot "backend\database\seeders\DemoNewsSeeder.php"

if (-not (Select-String -Path $CssPath -Pattern "Prism Aurora V5" -Quiet)) { throw "V5 CSS marker not found." }
if (-not (Test-Path $StudioPath)) { throw "Download Studio component is missing." }
if (-not (Test-Path $SeederPath)) { throw "DemoNewsSeeder is missing." }

Write-Host "V5 markers found." -ForegroundColor Green

if (Get-Command php -ErrorAction SilentlyContinue) {
    Push-Location (Join-Path $RepoRoot "backend")
    try {
        Write-Host "Checking PHP syntax and API routes..." -ForegroundColor Yellow
        & php -l "database/seeders/DemoNewsSeeder.php"
        if ($LASTEXITCODE -ne 0) { throw "DemoNewsSeeder syntax check failed." }
        & php artisan config:clear
        & php artisan route:list --path=api/v1
        if ($LASTEXITCODE -ne 0) { throw "Laravel API route check failed." }
    }
    finally { Pop-Location }
}

Push-Location (Join-Path $RepoRoot "SPTools")
try {
    Write-Host "Running Nuxt production build..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) { throw "Nuxt build failed." }
}
finally { Pop-Location }

Write-Host "V5 verification passed." -ForegroundColor Green
