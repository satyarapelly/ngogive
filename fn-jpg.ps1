$folder = "C:\Users\v-srapelly\source\repos\givengo\frontend\public\assets\images\programs"

Get-ChildItem -Path $folder -Recurse -File | Where-Object {
    $_.Extension -cin @(".JPG", ".JPEG", ".jpeg")
} | ForEach-Object {
    $oldPath = $_.FullName
    $newName = $_.BaseName + ".jpg"
    $newPath = Join-Path $_.DirectoryName $newName

    # Temporary rename avoids Windows case-only rename issues
    $tempName = $_.BaseName + "__temp__" + $_.Extension
    $tempPath = Join-Path $_.DirectoryName $tempName

    if (Test-Path -LiteralPath $newPath) {
        Write-Host "Skipping because target already exists: $newPath"
        return
    }

    Rename-Item -LiteralPath $oldPath -NewName $tempName
    Rename-Item -LiteralPath $tempPath -NewName $newName

    Write-Host "Renamed: $oldPath -> $newPath"
}