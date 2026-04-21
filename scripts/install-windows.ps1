# Delta Vraag en Antwoord Helper - Auto Downloader / Installer
$ProgressPreference = 'SilentlyContinue'
$InstallDir = "$env:USERPROFILE\DeltaModeratorHelper"

Write-Host "======================================================="
Write-Host " 🚀 Delta Vraag & Antwoord Helper (Auto-Setup)"
Write-Host "======================================================="
Write-Host ""

try {
    # 1. Zoek de meest recente release
    Write-Host "[1/3] Zoeken naar de nieuwste versie op GitHub..."
    $ApiUrl = "https://api.github.com/repos/m0nk111/template-helper/releases/latest"
    $Release = Invoke-RestMethod -Uri $ApiUrl
    $DownloadUrl = $Release.assets[0].browser_download_url

    # 2. Download zip bestand
    Write-Host "[2/3] Downloaden van versie $($Release.tag_name)..."
    $ZipPath = "$env:TEMP\delta-helper.zip"
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipPath

    # 3. Opschonen oude versie en uitpakken
    Write-Host "[3/3] Installeren naar $InstallDir..."
    if (Test-Path $InstallDir) { 
        Remove-Item -Recurse -Force $InstallDir 
    }
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
    Expand-Archive -Path $ZipPath -DestinationPath $InstallDir -Force

    # Opruimen
    Remove-Item $ZipPath -Force

    Write-Host ""
    Write-Host "✅ Succesvol gedownload en uitgepakt!"
    Write-Host "======================================================="
    Write-Host "🔥 LAATSTE HANDMATIGE STAP:"
    Write-Host "1. Chrome opent nu automatisch de extensie instellingen."
    Write-Host "2. Zet rechtsboven 'Ontwikkelaarsmodus' aan."
    Write-Host "3. Klik linksboven op 'Uitgepakte extensie laden'."
    Write-Host "4. Selecteer deze map: $InstallDir"
    Write-Host "======================================================="
    Write-Host ""
    
    # Probeer Chrome de openen op de juiste pagina
    Start-Process "chrome.exe" "chrome://extensions/" -ErrorAction SilentlyContinue
    
} catch {
    Write-Host "❌ Er is iets misgegaan: $_" -ForegroundColor Red
}

Write-Host "Druk op Enter om af te sluiten..."
Read-Host
