# One-time migration: asserts/* -> geo subfolders (same style folder)
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')

$posterRoot = Join-Path $root 'asserts\Gourmet recipe2'
$zineRoot   = Join-Path $root 'asserts\mini-zine'
$streetRoot = Join-Path $root 'asserts\Street View'

function Ensure-Dir($p) { if (-not (Test-Path -LiteralPath $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null } }

function Move-File($src, $destDir) {
    if (-not (Test-Path -LiteralPath $src)) { return }
    Ensure-Dir $destDir
    $dest = Join-Path $destDir (Split-Path $src -Leaf)
    if ((Resolve-Path $src).Path -eq (Resolve-Path $dest -ErrorAction SilentlyContinue).Path) { return }
    Move-Item -LiteralPath $src -Destination $dest -Force
}

# --- Posters ---
$hebeiPoster = Join-Path $posterRoot 'cn\hebei'
$hainanPoster = Join-Path $posterRoot 'cn\hainan'
$zhejiangPoster = Join-Path $posterRoot 'cn\zhejiang'
Get-ChildItem -LiteralPath $posterRoot -File -Filter '*.png' | ForEach-Object {
    $n = $_.Name
    if ($n -match '^cn_hebei_') { Move-File $_.FullName $hebeiPoster }
    elseif ($n -match '^xihu_') { Move-File $_.FullName $zhejiangPoster }
    else { Move-File $_.FullName $hainanPoster }
}

# --- mini-zine ---
$zineTemplates = Join-Path $zineRoot '_templates'
$hebeiZine = Join-Path $zineRoot 'cn\hebei'
$hainanZine = Join-Path $zineRoot 'cn\hainan'
Get-ChildItem -LiteralPath $zineRoot -File | ForEach-Object {
    $n = $_.Name
    if ($n -match '\.(jpg|jpeg)$' -or $n -match '^487c2f|^5bfa29c') { Move-File $_.FullName $zineTemplates }
    elseif ($n -match '^cn_hebei_') { Move-File $_.FullName $hebeiZine }
    elseif ($n -match '\.png$') { Move-File $_.FullName $hainanZine }
}

# --- Street View ---
$haikouStreet = Join-Path $streetRoot 'cn\hainan\haikou'
$tokyoStreet = Join-Path $streetRoot 'jp\tokyo'
Get-ChildItem -LiteralPath $streetRoot -File -Filter '*.png' | ForEach-Object {
    $n = $_.Name
    if ($n -match '^haikou_') { Move-File $_.FullName $haikouStreet }
    elseif ($n -match '^tokyo_') { Move-File $_.FullName $tokyoStreet }
    elseif ($n -match '^cn_hainan_haikou_') { Move-File $_.FullName $haikouStreet }
    elseif ($n -match '^jp_tokyo_') { Move-File $_.FullName $tokyoStreet }
}

Write-Host 'Done. Poster:' (Get-ChildItem -LiteralPath $posterRoot -Recurse -File -Filter '*.png' | Measure-Object).Count
Write-Host 'Zine:' (Get-ChildItem -LiteralPath $zineRoot -Recurse -File -Filter '*.png' | Measure-Object).Count
Write-Host 'Street:' (Get-ChildItem -LiteralPath $streetRoot -Recurse -File -Filter '*.png' | Measure-Object).Count
