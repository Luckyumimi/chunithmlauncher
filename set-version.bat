@echo off
title Chunithm Launcher Version Tool
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0set-version.ps1"
echo.
pause
