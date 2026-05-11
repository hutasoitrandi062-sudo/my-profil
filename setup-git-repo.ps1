$repoUrl = 'https://github.com/hutasoitrandi062-sudo/portfolio-web.git'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host 'Git tidak ditemukan. Jalankan install-git.ps1 terlebih dahulu.' -ForegroundColor Red
    exit 1
}

Set-Location $PSScriptRoot

if (-not (Test-Path .git)) {
    Write-Host 'Inisialisasi repository Git...' -ForegroundColor Cyan
    git init
}

$hasCommit = $false
try {
    git rev-parse --verify HEAD > $null 2>&1
    $hasCommit = $true
} catch {
    $hasCommit = $false
}

if (-not $hasCommit) {
    Write-Host 'Membuat commit awal...' -ForegroundColor Cyan
    git add README.md
    git commit -m 'first commit'
} else {
    Write-Host 'Repository sudah memiliki commit.' -ForegroundColor Yellow
}

Write-Host 'Menambahkan remote origin...' -ForegroundColor Cyan
if (git remote get-url origin > $null 2>&1) {
    git remote remove origin
}
git remote add origin $repoUrl

Write-Host 'Mendorong ke branch main...' -ForegroundColor Cyan
git push -u origin main
