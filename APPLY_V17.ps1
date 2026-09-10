$ErrorActionPreference = "Stop"

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
}

if (-not $python) {
    throw "Python was not found in PATH."
}

if ($python.Name -match '^py(\.exe)?$') {
    & $python.Source -3 (Join-Path $PSScriptRoot "APPLY_V17.py")
} else {
    & $python.Source (Join-Path $PSScriptRoot "APPLY_V17.py")
}

if ($LASTEXITCODE -ne 0) {
    throw "V17 installer failed with exit code $LASTEXITCODE."
}
