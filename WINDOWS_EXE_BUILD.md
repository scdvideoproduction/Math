# Windows EXE Build

Build the `.exe` on a Windows machine. PyInstaller does not cross-compile from macOS to Windows.

## Steps (Windows)

1. Copy this project folder to Windows.
2. Open `cmd` or PowerShell in the project folder.
3. Run:

```bat
build_windows_exe.bat
```

## Output

The executable will be created at:

`dist\Math Tug of War\Math Tug of War.exe`

## Notes

- This is an `onedir` build (recommended for Django + pywebview reliability).
- `db.sqlite3` is copied into the app folder. The app is configured to use the database next to the `.exe`.
- If the app window is blank on Windows, install **Microsoft Edge WebView2 Runtime**.
- If your antivirus flags the build, rebuild with signing or add a local allow-list (common for unsigned PyInstaller apps).
