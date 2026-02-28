@echo off
setlocal

REM Build the Windows desktop executable from this project folder.
REM Run this on a Windows machine (PowerShell or cmd) with Python installed.

py -m pip install --upgrade pip
py -m pip install -r requirements.txt
py -m PyInstaller --noconfirm "Math Tug of War.spec"

echo.
echo Build complete. Check:
echo   dist\Math Tug of War\Math Tug of War.exe
echo.
echo If the app window opens blank, install Microsoft Edge WebView2 Runtime.

endlocal
