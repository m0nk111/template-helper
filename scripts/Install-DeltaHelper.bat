@echo off
title Delta Helper Installer
color 0B
echo =======================================================
echo       Delta Vraag en Antwoord Helper Installer
echo =======================================================
echo.
echo Dit script downloadt en installeert automatisch de laatste versie.
echo Een moment geduld aub...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/m0nk111/template-helper/master/scripts/install-windows.ps1' -OutFile '%TEMP%\install-windows.ps1'; & '%TEMP%\install-windows.ps1'"

echo.
pause
