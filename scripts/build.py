#!/usr/bin/env python3
"""ProxyFaMega v2 — build ONE complete package:
    dist/ProxyFaMega-v<version>.zip
        Extention/chrome/   (MV3, load unpacked)
        Extention/edge/    (MV3, load unpacked)
        Extention/firefox/  (MV2, load via about:debugging or zip→xpi)
        Source/             (the full source tree)
The "Extention" folder name follows the user's requested layout verbatim."""
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
SOURCE_ITEMS = ["src", "test", "scripts", "screenshots", "README.md", "CHANGELOG.md", "CONTRIBUTING.md", "PRIVACY.md", "LICENSE", ".github", ".gitignore"]


def copy_tree(src, dst):
    shutil.copytree(src, dst, dirs_exist_ok=True)


def build_extension(target, cfg, out):
    for item in SHARED:
        copy_tree(os.path.join(SRC, item), os.path.join(out, item))
    shutil.copy(os.path.join(SRC, "manifests", cfg["manifest"]), os.path.join(out, "manifest.json"))
    shutil.copy(os.path.join(SRC, "background", cfg["background"]), os.path.join(out, "background.js"))
    shutil.copy(os.path.join(ROOT, "LICENSE"), os.path.join(out, "LICENSE"))


def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    bundle = os.path.join(DIST, f"ProxyFaMega-v{VERSION}")
    ext_root = os.path.join(bundle, "Extention")
    src_root = os.path.join(bundle, "Source")

    # ---- the three ready-to-load extensions ----
    counts = {}
    for target, cfg in TARGETS.items():
        out = os.path.join(ext_root, target)
        os.makedirs(out)
        build_extension(target, cfg, out)
        n = sum(len(files) for _d, _dn, files in os.walk(out))
        counts[target] = n
        print(f"built Extention/{target:8s} ({n} files)")

    # ---- the full source tree ----
    os.makedirs(src_root)
    for item in SOURCE_ITEMS:
        full = os.path.join(ROOT, item)
        if not os.path.exists(full):
            continue
        if os.path.isdir(full):
            copy_tree(full, os.path.join(src_root, item))
        else:
            shutil.copy(full, os.path.join(src_root, item))
    n_src = sum(len(files) for _d, _dn, files in os.walk(src_root))
    print(f"built Source/ ({n_src} files)")

    # ---- one zip with both folders at its root ----
    zpath = os.path.join(DIST, f"ProxyFaMega-v{VERSION}.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for dirpath, _dirs, files in os.walk(bundle):
            for f in sorted(files):
                full = os.path.join(dirpath, f)
                rel = os.path.relpath(full, bundle)  # Extention/... / Source/...
                zf.write(full, rel)
    size_kb = os.path.getsize(zpath) // 1024
    print(f"\nOK: {os.path.basename(zpath)}  ({sum(counts.values())} extension files + {n_src} source files, {size_kb} KB)")


if __name__ == "__main__":
    main()
