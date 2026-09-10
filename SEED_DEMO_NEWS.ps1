param(
    [switch]$Fresh
)

$ErrorActionPreference = "Stop"
$PackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$CandidateRoots = @((Get-Location).Path, $PackRoot, (Split-Path -Parent $PackRoot)) | Select-Object -Unique
$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if (Test-Path (Join-Path $candidate "backend\artisan")) { $RepoRoot = $candidate; break }
}
if (-not $RepoRoot) { throw "Could not find backend\artisan." }
if (-not (Get-Command php -ErrorAction SilentlyContinue)) { throw "PHP is not available in PATH." }

Push-Location (Join-Path $RepoRoot "backend")
try {
    & php artisan config:clear
    if ($LASTEXITCODE -ne 0) { throw "Laravel config clear failed." }

    if ($Fresh) {
        Write-Host "WARNING: -Fresh will delete all tables/data in the configured local database and rebuild them." -ForegroundColor Yellow
        & php artisan migrate:fresh --seed
    }
    else {
        Write-Host "Seeding/updating SP-Tools demo newsroom without dropping the database..." -ForegroundColor Cyan
        & php artisan db:seed
    }

    if ($LASTEXITCODE -ne 0) { throw "News seeding failed." }

    Write-Host ""
    Write-Host "Demo newsroom seeded successfully." -ForegroundColor Green
    Write-Host "API check: http://127.0.0.1:8000/api/v1/news"
}
finally { Pop-Location }
