#!/usr/bin/env python3
"""ProxyFaMega — build Chrome (MV3) / Firefox (MV2) / Edge (MV3) packages."""
import json
import os
import shutil
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")
DIST = os.path.join(ROOT, "dist")
VERSION = json.load(open(os.path.join(SRC, "manifests", "chrome.json")))["version"]

SHARED = ["common", "popup", "options", "assets", "_locales"]
TARGETS = {
    "chrome": {"manifest": "chrome.json", "background": "chromium.js"},
    "edge": {"manifest": "chrome.json", "background": "chromium.js"},
    "firefox": {"manifest": "firefox.json", "background": "firefox.js"},
}


def copy_tree(src, dst):
    shutil.copytree(src, dst, dirs_exist_ok=True)


def build(target, cfg):
    out = os.path.join(DIST, target)
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out)

    for item in SHARED:
        copy_tree(os.path.join(SRC, item), os.path.join(out, item))

    shutil.copy(os.path.join(SRC, "manifests", cfg["manifest"]), os.path.join(out, "manifest.json"))
    shutil.copy(os.path.join(SRC, "background", cfg["background"]), os.path.join(out, "background.js"))
    shutil.copy(os.path.join(ROOT, "LICENSE"), os.path.join(out, "LICENSE"))

    # package
    zpath = os.path.join(DIST, f"ProxyFaMega-v{VERSION}-{target}.zip")
    if os.path.exists(zpath):
        os.remove(zpath)
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, _dirs, files in os.walk(out):
            for f in sorted(files):
                full = os.path.join(dirpath, f)
                rel = os.path.relpath(full, out)
                zf.write(full, rel)
    return zpath, out


def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    total_files = 0
    for target, cfg in TARGETS.items():
        zpath, out = build(target, cfg)
        n = sum(len(files) for _d, _dn, files in os.walk(out))
        total_files += n
        size_kb = os.path.getsize(zpath) // 1024
        print(f"built {target:8s} -> {os.path.basename(zpath)}  ({n} files, {size_kb} KB)")
    print(f"\nOK: {len(TARGETS)} packages in dist/ ({total_files} files total)")


if __name__ == "__main__":
    main()
