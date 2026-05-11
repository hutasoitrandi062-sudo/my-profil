$gitUrl = 'https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.1/Git-2.42.0-64-bit.exe'
$tempInstaller = Join-Path $env:TEMP 'Git-2.42.0-64-bit.exe'

Write-Host "Mengunduh Git dari $gitUrl..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $gitUrl -OutFile $tempInstaller -UseBasicParsing

Write-Host 'Menjalankan installer Git...' -ForegroundColor Cyan
Start-Process -FilePath $tempInstaller -ArgumentList '/VERYSILENT', '/NORESTART' -Wait

Write-Host 'Instalasi Git selesai. Tutup terminal ini dan buka terminal baru.' -ForegroundColor Green
Write-Host 'Lalu jalankan setup-git-repo.ps1 untuk menginisialisasi repo Anda.' -ForegroundColor Green
