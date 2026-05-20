# =====================================================
# Create GiveNGO Frontend Structure
# =====================================================

$root = "C:\Users\v-srapelly\source\repos\givengo\frontend"

$folders = @(

    # React source folders
    "$root\src",
    "$root\src\components",
    "$root\src\pages",
    "$root\src\data",
    "$root\src\layouts",
    "$root\src\services",
    "$root\src\hooks",
    "$root\src\styles",
    "$root\src\utils",

    # Public assets
    "$root\public",
    "$root\public\images",
    "$root\public\assets",
    "$root\public\assets\images",
    "$root\public\assets\images\sdg",
    "$root\public\assets\images\programs",
    "$root\public\assets\images\programs\core-area",

    # Documents
    "$root\public\assets\documents",
    "$root\public\assets\documents\proposals",
    "$root\public\assets\documents\reports"
)

foreach ($folder in $folders) {

    if (!(Test-Path $folder)) {

        New-Item -ItemType Directory -Path $folder -Force | Out-Null

        Write-Host "Created: $folder" -ForegroundColor Green
    }
    else {

        Write-Host "Exists: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " GiveNGO Frontend Structure Created " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan