#!/usr/bin/env python3
"""Verify every i18n key used in source exists in the dictionary, and sanity-check code."""
import re
import sys
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src')

# 1) collect keys defined in i18n.js
i18n_src = open(os.path.join(ROOT, 'common', 'i18n.js'), encoding='utf-8').read()
defined = set(re.findall(r"'([a-zA-Z0-9_.]+)':\s*\[", i18n_src))

# 2) collect used keys across all JS files
used = set()
errors = []
for dirpath, _dirs, files in os.walk(ROOT):
    for fn in files:
        if not fn.endswith('.js'):
            continue
        path = os.path.join(dirpath, fn)
        src = open(path, encoding='utf-8').read()
        # i18n.t('key'), T('key'), t('key') — skip dynamic prefixes (key ends with '.')
        for m in re.finditer(r"""(?:i18n\.t\b|(?<![A-Za-z0-9_$])(?:t|T)\b)\(\s*'([a-zA-Z0-9_.]+)'""", src):
            k = m.group(1)
            if not k.endswith('.'):
                used.add(k)
        # dynamic 'nav.' + route / 'set.app.' + x / 'set.fs.' patterns
        for m in re.finditer(r"""\+\s*'(nav|set\.app|set\.fs)\.'""", src):
            pass  # handled below manually

# expand dynamic prefixes used in code
for r in ['dashboard', 'profiles', 'auto', 'settings', 'backup', 'about']:
    used.add('nav.' + r)
for a in ['auto', 'light', 'dark']:
    used.add('set.app.' + a)
for f in ['sm', 'md', 'lg']:
    used.add('set.fs.' + f)

missing = sorted(k for k in used if k not in defined)
unused = sorted(k for k in defined if k not in used)

print(f'defined: {len(defined)} keys | used: {len(used)} keys')
if missing:
    print('\nMISSING KEYS (used but not defined):')
    for k in missing:
        print('  -', k)
    sys.exit(1)
else:
    print('all used keys are defined ✓')

if unused:
    print(f'\nunused keys (harmless, {len(unused)}):', ', '.join(unused[:30]))
