$ErrorActionPreference = "Stop"

$CandidateRoots = @(
    (Get-Location).Path,
    (Split-Path -Parent $MyInvocation.MyCommand.Path)
) | Select-Object -Unique

$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if (Test-Path (Join-Path $candidate "SPTools\package.json")) {
        $RepoRoot = $candidate
        break
    }
}
if (-not $RepoRoot) { throw "Could not find SPTools\package.json." }

$TargetRoot = Join-Path $RepoRoot "SPTools"
$CssPath = Join-Path $TargetRoot "assets\css\main.css"
if (-not (Select-String -Path $CssPath -Pattern "Prism Studio V3 / Aurora Interface" -Quiet)) {
    throw "V3 marker was not found in assets/css/main.css. Apply the V3 pack first."
}

Set-Location $TargetRoot
Write-Host "V3 marker found." -ForegroundColor Green
Write-Host "Running Nuxt production build..." -ForegroundColor Yellow
& npm run build
if ($LASTEXITCODE -ne 0) { throw "Nuxt build failed." }
Write-Host "Build passed." -ForegroundColor Green
