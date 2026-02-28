# -*- mode: python ; coding: utf-8 -*-

from pathlib import Path
from PyInstaller.utils.hooks import collect_data_files

# SPECPATH is a built-in variable provided by PyInstaller containing the absolute path to this spec file's dir
project_dir = Path(SPECPATH).resolve()

datas = [
    (str(project_dir / 'game' / 'templates'), 'game/templates'),
    (str(project_dir / 'game' / 'static'), 'game/static'),
]

db_file = project_dir / 'db.sqlite3'
if db_file.exists():
    datas.append((str(db_file), '.'))

# pywebview selects platform backends dynamically, so include Windows backends explicitly.
hiddenimports = [
    'config.settings',
    'django.core.management',
    'django.contrib.staticfiles',
    'game.apps',
    'webview.platforms.winforms',
    'webview.platforms.edgechromium',
    'webview.platforms.mshtml',
]

# Bundle pywebview package data used at runtime.
datas += collect_data_files('webview')

a = Analysis(
    ['desktop_app.py'],
    pathex=[str(project_dir)],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='Math Tug of War',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=False,
    upx_exclude=[],
    name='Math Tug of War',
)
