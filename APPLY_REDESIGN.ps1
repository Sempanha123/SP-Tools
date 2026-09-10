$ErrorActionPreference = "Stop"

$PackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceRoot = Join-Path $PackRoot "redesign-files"

$CandidateRoots = @(
    (Get-Location).Path,
    $PackRoot,
    (Split-Path -Parent $PackRoot)
) | Select-Object -Unique

$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if ((Test-Path (Join-Path $candidate "frontend\package.json")) -and (Test-Path (Join-Path $candidate "backend\artisan"))) {
        $RepoRoot = $candidate
        break
    }
}

if (-not $RepoRoot) {
    throw "Could not find the repository root. Extract this pack into the folder containing frontend\package.json and backend\artisan."
}
if (-not (Test-Path $SourceRoot)) { throw "V5 redesign source folder was not found: $SourceRoot" }

Write-Host ""
Write-Host "SP-Tools Prism Aurora V5" -ForegroundColor Cyan
Write-Host "Real downloader studios + News demo newsroom" -ForegroundColor DarkCyan
Write-Host "Repository: $RepoRoot"
Write-Host ""
Write-Host "Tip: stop 'npm run dev' before applying. The installer retries locked files but will not kill your processes." -ForegroundColor Yellow
Write-Host ""

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $RepoRoot ".ui-redesign-v5-backup-$Timestamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
$files = Get-ChildItem -Path $SourceRoot -File -Recurse

function Copy-WithRetry {
    param(
        [Parameter(Mandatory=$true)][string]$Source,
        [Parameter(Mandatory=$true)][string]$Target,
        [int]$Attempts = 6
    )

    for ($i = 1; $i -le $Attempts; $i++) {
        try {
            Copy-Item -Force $Source $Target
            return
        }
        catch {
            if ($i -eq $Attempts) {
                throw "Could not update '$Target' after $Attempts attempts. Close that file in editors and stop the Nuxt dev server, then run APPLY_REDESIGN.ps1 again. Original error: $($_.Exception.Message)"
            }
            Start-Sleep -Milliseconds 650
        }
    }
}

Write-Host "Backup:     $BackupRoot"
Write-Host "Files:      $($files.Count)"
Write-Host ""

foreach ($source in $files) {
    $relative = $source.FullName.Substring($SourceRoot.Length).TrimStart('\','/')
    $target = Join-Path $RepoRoot $relative
    $backup = Join-Path $BackupRoot $relative

    if (Test-Path $target) {
        $backupDir = Split-Path -Parent $backup
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        Copy-WithRetry -Source $target -Target $backup
    }

    $targetDir = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    Copy-WithRetry -Source $source.FullName -Target $target
    Write-Host "updated  $relative" -ForegroundColor Green
}

$NuxtDir = Join-Path $RepoRoot "frontend\.nuxt"
if (Test-Path $NuxtDir) {
    try {
        Remove-Item -Recurse -Force $NuxtDir
        Write-Host "cleared  frontend\.nuxt" -ForegroundColor Yellow
    }
    catch {
        Write-Host "warning  Could not clear .nuxt because a process is using it. Stop Nuxt and delete frontend\.nuxt before restarting." -ForegroundColor Yellow
    }
}

$Backend = Join-Path $RepoRoot "backend"
if (Get-Command php -ErrorAction SilentlyContinue) {
    Push-Location $Backend
    try {
        & php artisan config:clear
        if ($LASTEXITCODE -eq 0) { Write-Host "cleared  Laravel config cache" -ForegroundColor Yellow }
    }
    finally { Pop-Location }
}

Write-Host ""
Write-Host "V5 applied successfully." -ForegroundColor Green
Write-Host "Backup saved at: $BackupRoot"
Write-Host ""
Write-Host "Optional demo newsroom data:" -ForegroundColor Cyan
Write-Host "  .\SEED_DEMO_NEWS.ps1"
Write-Host ""
Write-Host "For a completely NEW local database (DELETES existing database data):" -ForegroundColor Yellow
Write-Host "  .\SEED_DEMO_NEWS.ps1 -Fresh"
Write-Host ""
Write-Host "News API:"
Write-Host "  cd `"$(Join-Path $RepoRoot 'backend')`""
Write-Host "  php artisan serve --host=127.0.0.1 --port=8000"
Write-Host ""
Write-Host "Frontend:"
Write-Host "  cd `"$(Join-Path $RepoRoot 'frontend')`""
Write-Host "  npm run dev -- --port 3001"
Write-Host ""
Write-Host "Media service remains on port 8001. Hard-refresh with Ctrl+Shift+R."
