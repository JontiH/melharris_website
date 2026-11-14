#!/usr/bin/env bash
# Adds ?v=<version> to every script and stylesheet reference in public/,
# so browsers fetch new files after each deploy. Cloudflare's zone setting
# otherwise lets browsers keep .js and .css for 4 hours. Run in CI only; it
# edits files in place.
set -euo pipefail
v="${1:?usage: stamp-assets.sh <version>}"
cd "$(dirname "$0")/../public"
find . -type f \( -name '*.html' -o -name '*.js' -o -name '*.css' \) -print0 |
  xargs -0 sed -i -E \
    -e "s#([\"(])(/assets/[^\"?)]+\.(js|css))([\")])#\1\2?v=${v}\4#g" \
    -e "s#(from \")(\./[^\"?]+\.js)\"#\1\2?v=${v}\"#g"
