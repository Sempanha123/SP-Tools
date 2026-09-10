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
    if (Test-Path (Join-Path $candidate "SPTools\package.json")) {
        $RepoRoot = $candidate
        break
    }
}
if (-not $RepoRoot) {
    throw "Could not find repository root. Extract this pack into the folder that contains SPTools\package.json."
}
if (-not (Test-Path $SourceRoot)) { throw "V4 redesign source folder was not found: $SourceRoot" }

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupRoot = Join-Path $RepoRoot ".ui-redesign-v4-backup-$Timestamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
$files = Get-ChildItem -Path $SourceRoot -File -Recurse

Write-Host ""
Write-Host "SP-Tools Prism Aurora V4" -ForegroundColor Cyan
Write-Host "Platform identity + complete News theme pass + API bridge fixes" -ForegroundColor DarkCyan
Write-Host "Repository: $RepoRoot"
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
        Copy-Item -Force $target $backup
    }

    $targetDir = Split-Path -Parent $target
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
    Copy-Item -Force $source.FullName $target
    Write-Host "updated  $relative" -ForegroundColor Green
}


# Add platform identity props to the existing downloader result components
# without replacing the downloader business logic files.
$PlatformPages = @{
    "SPTools\pages\download\tiktok-download.vue" = "tiktok"
    "SPTools\pages\download\facebook-video-download.vue" = "facebook"
    "SPTools\pages\download\youtube-download.vue" = "youtube"
}

foreach ($entry in $PlatformPages.GetEnumerator()) {
    $pagePath = Join-Path $RepoRoot $entry.Key
    $platform = $entry.Value
    if (-not (Test-Path $pagePath)) { continue }

    $pageText = Get-Content -Raw -Path $pagePath
    if ($pageText -match "platform=`"$platform`"") { continue }

    $pageBackup = Join-Path $BackupRoot $entry.Key
    if (-not (Test-Path $pageBackup)) {
        $pageBackupDir = Split-Path -Parent $pageBackup
        New-Item -ItemType Directory -Force -Path $pageBackupDir | Out-Null
        Copy-Item -Force $pagePath $pageBackup
    }

    $pageText = $pageText.Replace("<DownloadMediaCard", "<DownloadMediaCard platform=`"$platform`"")
    $pageText = $pageText.Replace("<DownloadFormatRow", "<DownloadFormatRow platform=`"$platform`"")
    Set-Content -Path $pagePath -Value $pageText -Encoding UTF8
    Write-Host "patched  $($entry.Key) -> $platform identity" -ForegroundColor Cyan
}

$NuxtDir = Join-Path $RepoRoot "SPTools\.nuxt"
if (Test-Path $NuxtDir) {
    Remove-Item -Recurse -Force $NuxtDir
    Write-Host "cleared  SPTools\.nuxt" -ForegroundColor Yellow
}

$Backend = Join-Path $RepoRoot "backend"
if ((Test-Path (Join-Path $Backend "artisan")) -and (Get-Command php -ErrorAction SilentlyContinue)) {
    Push-Location $Backend
    try {
        & php artisan config:clear
        if ($LASTEXITCODE -eq 0) { Write-Host "cleared  Laravel config cache" -ForegroundColor Yellow }
    } finally { Pop-Location }
}

Write-Host ""
Write-Host "V4 applied successfully." -ForegroundColor Green
Write-Host "Backup saved at: $BackupRoot"
Write-Host ""
Write-Host "News API (terminal 1):"
Write-Host "  cd `"$(Join-Path $RepoRoot 'backend')`""
Write-Host "  php artisan serve --host=127.0.0.1 --port=8000"
Write-Host ""
Write-Host "Frontend (terminal 2):"
Write-Host "  cd `"$(Join-Path $RepoRoot 'SPTools')`""
Write-Host "  npm run dev -- --port 3001"
Write-Host ""
Write-Host "Media service remains on port 8001 when using image/download tools."
Write-Host "Then hard-refresh with Ctrl+Shift+R."
