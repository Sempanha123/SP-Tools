$ErrorActionPreference = "Continue"

if (-not (Test-Path ".\frontend\package.json")) {
    throw "Run VERIFY_V17.ps1 from the SP-Tools repository root."
}

Write-Host ""
Write-Host "PHP syntax..." -ForegroundColor Cyan
php -l .\backend\database\seeders\CategoryExpansionSeeder.php
php -l .\backend\database\seeders\DatabaseSeeder.php

Write-Host ""
Write-Host "Category route/data checks..." -ForegroundColor Cyan
Push-Location .\backend
php artisan route:list --path=api/v1/categories
Pop-Location

Write-Host ""
Write-Host "Frontend production build..." -ForegroundColor Cyan
Push-Location .\frontend
npm run build
Pop-Location
