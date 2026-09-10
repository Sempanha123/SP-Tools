$ErrorActionPreference = "Stop"

$PackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$SourceRoot = Join-Path $PackRoot "redesign-files\SPTools"

$CandidateRoots = @(
    (Get-Location).Path,
    $PackRoot,
    (Split-Path -Parent $PackRoot)
) | Select-Object -Unique

$RepoRoot = $null
foreach ($candidate in $CandidateRoots) {
    if (Test-Path (Join-Path $candidate "SPTools\package.json")) {
        $RepoRoot = $candidate
        break
    }
}

if (-not $RepoRoot) {
    throw "Could not find repository root. Put this extracted pack in the folder that contains SPTools\package.json, then run it again."
}

$TargetRoot = Join-Path $RepoRoot "SPTools"
if (-not (Test-Path $SourceRoot)) {
    throw "V3 redesign source folder was not found: $SourceRoot"
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $RepoRoot ".ui-redesign-v3-backup-$Timestamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$files = Get-ChildItem -Path $SourceRoot -File -Recurse

Write-Host ""
Write-Host "SP-Tools Prism Aurora V3" -ForegroundColor Cyan
Write-Host "High-end UI/UX + motion upgrade" -ForegroundColor DarkCyan
Write-Host "Repository: $RepoRoot"
Write-Host "Backup:     $BackupRoot"
Write-Host "Files:      $($files.Count)"
Write-Host ""

foreach ($source in $files) {
    $relative = $source.FullName.Substring($SourceRoot.Length).TrimStart('\','/')
    $target = Join-Path $TargetRoot $relative
    $backup = Join-Path $BackupRoot $relative

    if (Test-Path $target) {
        $backupDir = Split-Path -Parent $backup
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        Copy-Item -Force $target $backup
    }

    $targetDir = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    Copy-Item -Force $source.FullName $target
    Write-Host "updated  SPTools\$relative" -ForegroundColor Green
}

$NuxtDir = Join-Path $TargetRoot ".nuxt"
if (Test-Path $NuxtDir) {
    Remove-Item -Recurse -Force $NuxtDir
    Write-Host "cleared  SPTools\.nuxt" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "V3 redesign applied." -ForegroundColor Green
Write-Host "Backup saved at: $BackupRoot"
Write-Host ""
Write-Host "Run:"
Write-Host "  cd `"$TargetRoot`""
Write-Host "  npm run dev -- --port 3001"
Write-Host ""
Write-Host "Then hard-refresh the browser with Ctrl+Shift+R."
