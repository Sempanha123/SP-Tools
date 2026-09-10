$ErrorActionPreference = "Stop"

if (-not (Test-Path ".\backend\artisan")) {
    throw "Run this script from the SP-Tools repository root."
}

Push-Location .\backend

Write-Host "Ensuring categories..." -ForegroundColor Cyan
php artisan db:seed --class="Database\Seeders\CategorySeeder"

Write-Host "Ensuring tags..." -ForegroundColor Cyan
php artisan db:seed --class="Database\Seeders\TagSeeder"

Write-Host "Ensuring base demo news and authors..." -ForegroundColor Cyan
php artisan db:seed --class="Database\Seeders\DemoNewsSeeder"

Write-Host "Adding complete category archive fixtures..." -ForegroundColor Cyan
php artisan db:seed --class="Database\Seeders\CategoryExpansionSeeder"

Pop-Location

Write-Host ""
Write-Host "V17 category data is ready." -ForegroundColor Green
Write-Host ""
Write-Host "Test these routes:" -ForegroundColor Cyan
Write-Host "http://127.0.0.1:3001/news/category/business"
Write-Host "http://127.0.0.1:3001/news/category/technology"
Write-Host "http://127.0.0.1:3001/news/category/science"
Write-Host "http://127.0.0.1:3001/news/category/climate"
Write-Host "http://127.0.0.1:3001/news/category/health"
