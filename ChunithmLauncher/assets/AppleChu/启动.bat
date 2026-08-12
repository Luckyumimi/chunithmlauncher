@echo off
title Start Game nya~
set OPENSSL_ia32cap=:~0x20000000

pushd %~dp0

start /min amdaemon.exe

chusanApp.exe

taskkill /f /im amdaemon.exe > nul 2>&1

echo.
echo Game processes have terminated
popd
pause

REM nya