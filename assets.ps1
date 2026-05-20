# =========================================================
# Give For Society - Program Image Organizer
# =========================================================

# Source content folder
$sourceRoot = "C:\Users\v-srapelly\source\repos\givengo\content"

# Destination website assets folder
$destinationRoot = "C:\Users\v-srapelly\source\repos\givengo\public\assets\images\programs"

# =========================================================
# Program Folder Mapping
# LEFT  = Existing folder names in /content/
# RIGHT = Website program folder names
# =========================================================

$programMappings = @{

    # Menstrual Hygiene
    "SthreeSwabhiman"                = "sthree-swabhiman"
    "MHM"                            = "sthree-swabhiman"
    "MenstrualHygiene"               = "sthree-swabhiman"

    # School Infrastructure
    "EmpoweringRuralLearning"        = "empowering-rural-learning"
    "SchoolInfrastructure"           = "empowering-rural-learning"
    "STEMLabs"                       = "empowering-rural-learning"

    # Integrated Learning Centers
    "ILC"                            = "integrated-learning-centers-ilc"
    "IntegratedLearningCenters"      = "integrated-learning-centers-ilc"
    "GVK"                            = "integrated-learning-centers-ilc"

    # Health Initiative
    "ArogyaSetu"                     = "arogyasetu-health-initiative"
    "HealthCamps"                    = "arogyasetu-health-initiative"

    # Women & Youth Empowerment
    "WomenEmpowerment"               = "women-youth-empowerment"
    "SkillDevelopment"               = "women-youth-empowerment"
    "YouthEmpowerment"               = "women-youth-empowerment"

    # Sports
    "Sports"                         = "sports-youth-development"
    "GrassrootsSports"               = "sports-youth-development"
}

# =========================================================
# Create destination folders
# =========================================================

$programFolders = $programMappings.Values | Select-Object -Unique

foreach ($folder in $programFolders) {

    $path = Join-Path $destinationRoot $folder

    if (!(Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created Folder: $path" -ForegroundColor Green
    }
}

# =========================================================
# Supported image extensions
# =========================================================

$imageExtensions = @("*.jpg", "*.jpeg", "*.png", "*.webp", "*.gif")

# =========================================================
# Copy Images
# =========================================================

foreach ($mapping in $programMappings.GetEnumerator()) {

    $sourceFolder = Join-Path $sourceRoot $mapping.Key
    $destinationFolder = Join-Path $destinationRoot $mapping.Value

    if (Test-Path $sourceFolder) {

        foreach ($ext in $imageExtensions) {

            $files = Get-ChildItem -Path $sourceFolder -Filter $ext -File -Recurse -ErrorAction SilentlyContinue

            foreach ($file in $files) {

                $destinationFile = Join-Path $destinationFolder $file.Name

                Copy-Item $file.FullName $destinationFile -Force

                Write-Host "Copied: $($file.Name) -> $($mapping.Value)" -ForegroundColor Cyan
            }
        }
    }
    else {

        Write-Host "Source Folder Not Found: $sourceFolder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " NGO Program Images Organized Successfully " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green